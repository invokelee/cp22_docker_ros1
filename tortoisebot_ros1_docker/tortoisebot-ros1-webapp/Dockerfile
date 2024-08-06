# Start from ROS base image
FROM osrf/ros:noetic-desktop-full-focal

# Make a catkin workspace
WORKDIR /
RUN mkdir -p /catkin_ws/src
WORKDIR /catkin_ws/src

# Install Git
RUN apt-get update && apt-get install -y \
    git sudo ros-noetic-rosbridge-server

COPY ./course_web_dev_ros ./course_web_dev_ros
COPY ./async_web_server_cpp ./async_web_server_cpp
COPY ./web_video_server ./web_video_server

WORKDIR /catkin_ws

# Build your ROS packages
RUN /bin/bash -c "source /opt/ros/noetic/setup.bash; cd /catkin_ws; catkin_make"

# Source the workspace every time a new shell is opened in the container
RUN echo source /catkin_ws/devel/setup.bash >> ~/.bashrc

# Set the entry point to start a bash shell
# CMD ["/bin/bash"]
CMD ["/catkin_ws/entrypoint.sh"]
