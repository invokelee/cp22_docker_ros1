#! /bin/bash
echo "[$(date +'%F %T')] Starting the Mapping for Real tortoisebot..."
hostname
cat /etc/hosts
echo $ROS_MASTER_URI
source /catkin_ws/carto_ws/install_isolated/setup.bash \
&& export ROS_PACKAGE_PATH=$ROS_PACKAGE_PATH:/catkin_ws/src \
&& roslaunch --wait tortoisebot_slam tortoisebot_slam.launch
