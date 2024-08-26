var app = new Vue({
    el: '#app',
    // storing the state of the page
    data: {
        connected: false,
        ros: null,
        logs: [],
        loading: false,
        rosbridge_address: 'wss://i-024dd9ea14b87875b.robotigniteacademy.com/f7145288-ca18-4506-946c-47c9537208eb/rosbridge/',
        port: '9090',
        // Model 3D viewer
        viewer: null,
        tfClient: null,
        urdfClient: null,
        // Map viewer
        mapViewer: null,
        mapGridClient: null,
        interval: null,
        // dragging data
        dragging: false,
        drg_x: 'no',
        drg_y: 'no',
        dragCircleStyle: {
            margin: '0px',
            top: '0px',
            left: '0px',
            display: 'none',
            width: '75px',
            height: '75px',
        },
        // joystick valules
        joystick: {
            vertical: 0,
            horizontal: 0,
        },
        lx: 0,
        az: 0,
        kv: 1,
        angular_dir: -1,
        pubInterval: null,
        // waypoint
        target_wp: 0,
        action: {
            goal: { position: { x: 0, y: 0, z: 0 } },
            feedback: { position: 0, state: 'idle' },
            result: { success: false },
            status: { status: 0, text: '' },
        },
        cur_pos: {
            x: 0,
            y: 0,
        },
        wplist: [
            { x: 0.25, y: -0.48 },
            { x: 0.60, y: -0.45 },
            { x: 0.60, y: 0 },
            { x: 0.60, y: 0.45 },
            { x: 0, y: 0.45 },
            { x: -0.60, y: 0.45 },
            { x: -0.60, y: 0 },
            { x: -0.60, y: -0.45 },
            { x: -0.60, y: 0 },
            { x: 0, y: 0 },
        ],

    },
    // helper methods to connect to ROS
    methods: {
        connect: function () {
            this.loading = true
            this.ros = new ROSLIB.Ros({
                url: this.rosbridge_address
            })
            this.ros.on('connection', () => {
                this.logs.unshift((new Date()).toTimeString() + ' - Connected!')
                this.connected = true
                this.loading = false
                // 3D Viewer
                this.setup3DViewer()
                // Map Viewer
                this.mapViewer = new ROS2D.Viewer({
                    divID: 'divMap',
                    width: 420,
                    height: 360
                    // width: 840,
                    // height: 300
                })

                // Setup the map client.
                this.mapGridClient = new ROS2D.OccupancyGridClient({
                    ros: this.ros,
                    rootObject: this.mapViewer.scene,
                    continuous: true,
                })
                // Scale the canvas to fit to the map
                this.mapGridClient.on('change', () => {
                    this.mapViewer.scaleToDimensions(this.mapGridClient.currentGrid.width, this.mapGridClient.currentGrid.height);
                    this.mapViewer.shift(this.mapGridClient.currentGrid.pose.position.x, this.mapGridClient.currentGrid.pose.position.y)
                })

                // Camera viewer
                this.setCamera()
                // using timer callback func() for joystick
                this.pubInterval = setInterval(this.moveRobotbByJoysticVals, 100)
            })
            this.ros.on('error', (error) => {
                this.logs.unshift((new Date()).toTimeString() + ` - Error: ${error}`)
            })
            this.ros.on('close', () => {
                this.logs.unshift((new Date()).toTimeString() + ' - Disconnected!')
                this.connected = false
                this.loading = false
                // 3D Viewer
                this.unset3DViewer()
                // Map Viewer
                document.getElementById('divMap').innerHTML = ''
                // Camera
                document.getElementById('divCamera').innerHTML = ''
                // joystick
                clearinterval(this.pubInterval)
            })
        },
        disconnect: function () {
            this.ros.close()
        },
        // Model 3D viewer
        setup3DViewer() {
            this.viewer = new ROS3D.Viewer({
                background: '#cccccc',
                divID: 'div3DViewer',
                width: 400,
                height: 300,
                antialias: true,
                fixedFrame: 'odom'
            })

            // Add a grid.
            this.viewer.addObject(new ROS3D.Grid({
                color: '#0181c4',
                cellSize: 0.5,
                num_cells: 20
            }))

            // Setup a client to listen to TFs.
            this.tfClient = new ROSLIB.TFClient({
                ros: this.ros,
                angularThres: 0.01,
                transThres: 0.01,
                rate: 10.0
            })

            // Setup the URDF client.
            this.urdfClient = new ROS3D.UrdfClient({
                ros: this.ros,
                param: 'robot_description',
                tfClient: this.tfClient,
                // We use "path: location.origin + location.pathname"
                // instead of "path: window.location.href" to remove query params,
                // otherwise the assets fail to load
                path: location.origin + location.pathname,
                rootObject: this.viewer.scene,
                loader: ROS3D.COLLADA_LOADER_2
            })
        },
        unset3DViewer() {
            document.getElementById('div3DViewer').innerHTML = ''
        },
        // Camera viewer
        setCamera: function () {
            let without_wss = this.rosbridge_address.split('wss://')[1]
            console.log(without_wss)
            let domain = without_wss.split('/')[0] + '/' + without_wss.split('/')[1]
            console.log(domain)
            let host = domain + '/cameras'
            let viewer = new MJPEGCANVAS.Viewer({
                divID: 'divCamera',
                host: host,
                width: 320,
                height: 240,
                topic: '/camera/image_raw',
                ssl: true,
            })
        },
        // joystic control command
        moveRobotbByJoysticVals: function () {
            let topic = new ROSLIB.Topic({
                ros: this.ros,
                name: '/cmd_vel',
                messageType: 'geometry_msgs/Twist'
            })
            this.lx = this.joystick.vertical * this.kv
            this.az = this.joystick.horizontal * this.kv * this.angular_dir
            let message = new ROSLIB.Message({
                linear: { x: this.lx, y: 0, z: 0, },
                angular: { x: 0, y: 0, z: this.az, },
            })
            topic.publish(message)
        },
        startDrag() {
            this.dragging = true
            this.drag_x = this.drag_y = 0
        },
        stopDrag() {
            this.dragging = false
            this.drag_x = this.drag_y = 'no'
            this.dragCircleStyle.display = 'none'
            this.resetJoystickVals()
        },
        doDrag(event) {
            if (this.dragging) {
                this.drag_x = event.offsetX
                this.drag_y = event.offsetY
                let ref = document.getElementById('dragstartzone')
                this.dragCircleStyle.display = 'inline-block'

                let minTop = ref.offsetTop - parseInt(this.dragCircleStyle.height) / 2
                let maxTop = minTop + 200
                let top = this.drag_y + minTop
                this.dragCircleStyle.top = `${top}px`

                let minLeft = ref.offsetLeft - parseInt(this.dragCircleStyle.width) / 2
                let maxLeft = minLeft + 200
                let left = this.drag_x + minLeft
                this.dragCircleStyle.left = `${left}px`

                this.setJoystickVals()
                // // call the move func in the doDrag func
                // this.moveRobotbByJoysticVals()
            }
        },
        setJoystickVals() {
            this.joystick.vertical = -1 * ((this.drag_y / 200) - 0.5)
            this.joystick.horizontal = +1 * ((this.drag_x / 200) - 0.5)
        },
        resetJoystickVals() {
            this.joystick.vertical = 0
            this.joystick.horizontal = 0
        },
        sendGoal: function () {
            let actionClient = new ROSLIB.ActionClient({
                ros: this.ros,
                serverName: '/tortoisebot_as',
                actionName: 'course_web_dev_ros/WaypointActionAction'
            })
            this.action.goal.position.x = this.wplist[this.target_wp].x
            this.action.goal.position.y = this.wplist[this.target_wp].y
            this.logs.unshift('Goal: ' + this.action.goal.position.x + ', '
                + this.action.goal.position.y)
            this.goal = new ROSLIB.Goal({
                actionClient: actionClient,
                goalMessage: {
                    position: this.action.goal.position
                }
            })

            this.goal.on('status', (status) => {
                this.action.status = status
                // this.logs.unshift(this.action.status.text)
            })

            this.goal.on('feedback', (feedback) => {
                this.action.feedback = feedback
                this.cur_pos.x = feedback.position.x
                this.cur_pos.y = feedback.position.y
            })

            this.goal.on('result', (result) => {
                this.action.result = result
            })

            this.goal.send()

        },
        cancelGoal: function () {
            this.goal.cancel()
        },
    },
    mounted() {
        window.addEventListener('mouseup', this.stopDrag)

    },
})