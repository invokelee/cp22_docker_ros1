# Use the official ROS Noetic image as a parent image
FROM ros:noetic

# Update the package list and install the ROS Navigation Stack and Rviz
RUN apt-get update && apt-get install -y ros-noetic-navigation \
ros-noetic-gmapping ros-noetic-slam-gmapping \
ros-noetic-joy ros-noetic-teleop-twist-joy ros-noetic-teleop-twist-keyboard ros-noetic-rviz

# Set up the catkin workspace
RUN mkdir -p /catkin_ws/src
WORKDIR /catkin_ws/src

# Copy the map, configuration and launch files needed for navigation
COPY ./tortoisebot/tortoisebot_description ./tortoisebot_description
COPY ./tortoisebot/tortoisebot_navigation ./tortoisebot_navigation
COPY ./tortoisebot/tortoisebot_slam ./tortoisebot_slam

WORKDIR /catkin_ws
RUN /bin/bash -c "source /opt/ros/noetic/setup.bash && catkin_make"

# Source the setup.bash file automatically when the container starts
RUN echo "source /catkin_ws/devel/setup.bash" >> ~/.bashrc

# Set up the Network Configuration
# Example with the ROS_MASTER_URI value set as the one running on the Host System
# ENV ROS_MASTER_URI http://1_simulation:11311

# Start a bash shell when the container starts
WORKDIR /catkin_ws
# CMD ["bash"]
CMD ["/catkin_ws/entrypoint.sh"]
