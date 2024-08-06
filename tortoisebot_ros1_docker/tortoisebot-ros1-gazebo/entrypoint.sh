#! /bin/bash
echo "[$(date +'%F %T')] Starting Simulation..."
source /catkin_ws/devel/setup.bash && roslaunch tortoisebot_gazebo tortoisebot_playground.launch
