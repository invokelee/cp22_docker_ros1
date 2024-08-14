#! /bin/bash
echo "[$(date +'%F %T')] Starting Real Tortoisebot firmware bringup..."
hostname
cat /etc/hosts
source /catkin_ws/devel/setup.bash && roslaunch tortoisebot_firmware bringup.launch &
sleep 10
source /catkin_ws/carto_ws/install_isolated/setup.bash \
&& export ROS_PACKAGE_PATH=$ROS_PACKAGE_PATH:/catkin_ws/src \
&& roslaunch tortoisebot_firmware server_bringup.launch 