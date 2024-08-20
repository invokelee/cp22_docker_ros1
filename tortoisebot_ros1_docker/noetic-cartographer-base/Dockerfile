# Base image
FROM invokelee/mx-noetic-base:1.0

SHELL ["/bin/bash", "-c"]
# Install noetic packages and other dependencies
# RUN apt purge -y unattended-upgrades
RUN apt-get update

ENV DEBIAN_FRONTEND=noninteractive
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

RUN apt-get install -y ros-noetic-joy ros-noetic-teleop-twist-joy \
    ros-noetic-teleop-twist-keyboard ros-noetic-amcl ros-noetic-map-server \
    ros-noetic-move-base ros-noetic-urdf ros-noetic-xacro \
    ros-noetic-rqt-image-view ros-noetic-gmapping ros-noetic-navigation \ 
    ros-noetic-joint-state-publisher ros-noetic-robot-state-publisher \
    ros-noetic-slam-gmapping ros-noetic-dwa-local-planner \ 
    ros-noetic-joint-state-publisher-gui ros-noetic-ira-laser-tools

RUN apt-get update && apt-get install -y \
  ros-noetic-ros-control \
  ros-noetic-ros-controllers \
  ros-noetic-joint-state-controller \
  ros-noetic-robot-localization \
  ros-noetic-tf2-ros \
  ros-noetic-tf2-tools \
  ros-noetic-compressed-image-transport \
  ros-noetic-compressed-depth-image-transport \
  ros-noetic-camera-info-manager \
  && rm -rf /var/lib/apt/lists/*

# Install Cartographer ROS for noetic 
RUN apt-get update
RUN apt-get install -y python3-wstool python3-rosdep ninja-build stow
RUN apt-get update && apt-get install -y \
    git python-is-python3

RUN mkdir -p /catkin_ws/carto_ws
WORKDIR /catkin_ws/carto_ws
# RUN cd /catkin_ws/carto_ws

RUN wstool init src
RUN wstool merge -t src https://raw.githubusercontent.com/cartographer-project/cartographer_ros/master/cartographer_ros.rosinstall
RUN wstool update -t src 
# ; exit 0

RUN rm -f /etc/ros/rosdep/sources.list.d/20-default.list
WORKDIR /catkin_ws/carto_ws/src/cartographer
COPY /tortoisebot_ros1_docker/tortoisebot-ros1-real/package.xml.sav ./package.xml

WORKDIR /catkin_ws/carto_ws
RUN rosdep init
RUN rosdep update
RUN rosdep install --from-paths src --ignore-src --rosdistro=noetic -y

RUN /bin/bash -c "src/cartographer/scripts/install_abseil.sh"
# RUN sudo apt-get remove ros-${ROS_DISTRO}-abseil-cpp

RUN /bin/bash -c "source /opt/ros/noetic/setup.bash && catkin_make_isolated --install --use-ninja"

RUN apt-get install -y libraspberrypi-bin libraspberrypi-dev

# Source ros noetic and build workspace
RUN mkdir -p /catkin_ws/src
WORKDIR /catkin_ws
RUN /bin/bash -c "source /opt/ros/noetic/setup.bash && catkin_make"

# Source the setup.bash file before executing further commands
RUN echo "source /catkin_ws/devel/setup.bash" >> ~/.bashrc

# Start a bash shell when the container starts
CMD ["bash"]
