#!/usr/bin/env bash

# Jump to root directory

PROJECT_NAME=cr
REMOTE_REGISTRY=172.17.5.144:5001


##### Functions
function usage
{
    echo "usage: build_docker.sh [[--remote_registry remote_registry_ip_port] [--project_name project_name ] [--version project_version]]"
}


##### Main
if [ "$1" == "" ]; then
    usage
    exit 1
fi

while [ "$1" != "" ]; do
    case $1 in
        -rr | --remote_registry )         shift
                                REMOTE_REGISTRY=$1
                                ;;
        -pn | --project_name )     shift
                                REMOTE_REGISTRY=$1
                                ;;
        -v | --version)     shift
                                VERSION=$1
                                ;;
        * )                     usage
                                exit 1
    esac
    shift
done


##### Build docker image
TAG_IMAGE=${REMOTE_REGISTRY}/${PROJECT_NAME}:${VERSION}

docker build -t ${PROJECT_NAME} -f docker/Dockerfile .
docker tag ${PROJECT_NAME} ${TAG_IMAGE}
docker push ${TAG_IMAGE}
