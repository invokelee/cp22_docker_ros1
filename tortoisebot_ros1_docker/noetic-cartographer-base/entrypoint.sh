#! /bin/bash
echo "[$(date +'%F %T')] Starting Tortoisebot firmware bringup..."
source /catkin_ws/devel/setup.bash && roslaunch tortoisebot_firmware bringup.launch
