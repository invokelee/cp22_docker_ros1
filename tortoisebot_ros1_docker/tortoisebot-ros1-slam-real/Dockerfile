# Use the previous built base image, noetic-cartographer-base as a parent image
FROM invokelee/noetic-cartographer-base:1.0

# Install some updates and utils
RUN apt-get update
RUN apt-get install -y python3-rpi.gpio iputils-ping vim

# Set up the catkin workspace
RUN mkdir -p /catkin_ws/src
WORKDIR /catkin_ws/src

COPY ./tortoisebot/tortoisebot_firmware ./tortoisebot_firmware
COPY ./tortoisebot/tortoisebot_description ./tortoisebot_description
COPY ./tortoisebot/tortoisebot_navigation ./tortoisebot_navigation
COPY ./tortoisebot/tortoisebot_slam ./tortoisebot_slam

WORKDIR /catkin_ws
RUN /bin/bash -c "source /opt/ros/noetic/setup.bash && catkin_make"

# Source the setup.bash file automatically when the container starts
RUN echo "source /catkin_ws/devel/setup.bash" >> ~/.bashrc

# Set up the Network Configuration
# Example with the ROS_MASTER_URI value set as the one running on the Host System
# ENV ROS_MASTER_URI http://real1_bringup:11311

# Start a bash shell when the container starts
WORKDIR /catkin_ws
CMD ["bash"]
# source /catkin_ws/devel/setup.bash && roslaunch tortoisebot_slam tortoisebot_slam_w_cartographer.launch
