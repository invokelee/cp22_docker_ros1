#! /bin/bash
echo "[$(date +'%F %T')] Starting Waypoint Action server..."
source /catkin_ws/devel/setup.bash && rosrun course_web_dev_ros tortoisebot_action_server.py
