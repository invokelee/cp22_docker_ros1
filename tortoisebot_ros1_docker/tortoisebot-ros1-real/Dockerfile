# Base image
FROM invokelee/noetic-cartographer-base:1.0

# Install some updates and utils
RUN apt-get update
RUN apt-get install -y python3-rpi.gpio iputils-ping vim

# make workspace
RUN mkdir -p /catkin_ws/src
RUN mkdir -p /root/.ros/camera_info
WORKDIR /catkin_ws/src

# Copy the files in the current directory into the container
COPY ./tortoisebot/tortoisebot_firmware ./tortoisebot_firmware
COPY ./tortoisebot/tortoisebot_description ./tortoisebot_description
COPY ./raspicam_node ./raspicam_node
COPY ./tortoisebot/tortoisebot_control ./tortoisebot_control
COPY ./tortoisebot/ydlidar_ros ./ydlidar_ros
COPY ./tortoisebot_ros1_docker/tortoisebot-ros1-real/camerav2_410x308.yaml /root/.ros/camera_info/camerav2_410x308.yaml 

# Source ros noetic and build workspace
WORKDIR /catkin_ws
RUN /bin/bash -c "source /opt/ros/noetic/setup.bash && catkin_make"

# Source the setup.bash file before executing further commands
RUN echo "source /catkin_ws/devel/setup.bash" >> ~/.bashrc

# Start a bash shell when the container starts
WORKDIR /catkin_ws
CMD ["bash"]
# source /catkin_ws/devel/setup.bash && roslaunch tortoisebot_firmware bringup.launch
