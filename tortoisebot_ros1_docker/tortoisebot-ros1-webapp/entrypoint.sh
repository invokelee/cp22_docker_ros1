#! /bin/bash
echo "[$(date +'%F %T')] Starting Simulation..."
source /catkin_ws/devel/setup.bash && roslaunch course_web_dev_ros web.launch
