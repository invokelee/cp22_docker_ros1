# Base image
FROM osrf/ros:noetic-desktop-full-focal

# Install Gazebo 11 and other dependencies
RUN apt-get update && apt-get install -y \
  gazebo11 \
  ros-noetic-gazebo-ros-pkgs \
  ros-noetic-gazebo-ros-control \
  ros-noetic-ros-control \
  ros-noetic-ros-controllers \
  ros-noetic-joint-state-publisher \
  ros-noetic-joint-state-controller \
  ros-noetic-robot-state-publisher \
  ros-noetic-robot-localization \
  ros-noetic-xacro \
  ros-noetic-tf2-ros \
  ros-noetic-tf2-tools \
  && rm -rf /var/lib/apt/lists/*

# make workspace
WORKDIR /
RUN mkdir -p /catkin_ws/src
WORKDIR /catkin_ws/src

# Copy the files in the current directory into the container
# COPY ../README.md ./tortoisebot_gazebo
COPY ./tortoisebot/tortoisebot_gazebo ./tortoisebot_gazebo
COPY ./tortoisebot/tortoisebot_description ./tortoisebot_description


# Source ros noetic and build workspace
RUN /bin/bash -c "source /opt/ros/noetic/setup.bash && cd /catkin_ws && catkin_make"

# Source the setup.bash file before executing further commands
RUN echo "source /catkin_ws/devel/setup.bash" >> ~/.bashrc

# Start a bash shell when the container starts
WORKDIR /catkin_ws
# CMD ["bash"]
CMD ["/catkin_ws/entrypoint.sh"]
