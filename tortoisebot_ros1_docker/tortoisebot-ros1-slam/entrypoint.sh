#! /bin/bash
echo "[$(date +'%F %T')] Starting the Mapping..."
source /catkin_ws/devel/setup.bash && roslaunch tortoisebot_slam mapping.launch
