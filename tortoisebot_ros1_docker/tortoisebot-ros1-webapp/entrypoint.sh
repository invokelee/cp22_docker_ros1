#! /bin/bash
echo "[$(date +'%F %T')] Starting Simulation..."
sleep 10
source /catkin_ws/devel/setup.bash && roslaunch course_web_dev_ros web.launch &
roslaunch course_web_dev_ros tf2_web.launch &
sleep 5
cd /webpage_ws/tortoisebot_webapp && python -m http.server 7000
