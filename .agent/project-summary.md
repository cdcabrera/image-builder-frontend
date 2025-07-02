# Project Summary

This document provides concise answers to key questions about the Image Builder Frontend repository.

## What does this repo actually do?

This repository contains the **frontend user interface** for Red Hat's Image Builder service. It's a React TypeScript web application that provides a graphical interface for:

- **Creating custom operating system images** through an intuitive wizard interface
- **Managing image blueprints** (templates/configurations for building images)
- **Viewing and organizing built images** in a comprehensive table interface
- **Supporting multiple image types** including conventional RPM-based and immutable OSTree-based systems
- **Integrating with Red Hat Cloud Services** for authentication, notifications, and deployment

The application serves as the user-facing frontend that communicates with backend Image Builder APIs to provide a complete image building and management experience.

## What is Image Builder?

**Image Builder** is Red Hat's service for creating custom operating system images at scale. It allows users to:

### Core Functionality
- **Build custom OS images** with specific packages, configurations, and customizations
- **Support multiple output formats** (AMI, QCOW2, ISO, OCI containers, etc.)
- **Target different platforms** (AWS, Azure, GCP, VMware, bare metal, edge devices)
- **Manage image lifecycle** from creation to deployment and updates

### Two Main Image Types

1. **Conventional (RPM-DNF) Images**
   - Traditional package-based systems
   - Managed using DNF package manager and RPM packages
   - Simple and adaptive method for system management over lifecycle
   - Suitable for traditional server and desktop deployments

2. **Immutable (OSTree) Images**
   - Complete operating systems ready for remote installation at scale
   - Managed through central image repositories
   - Atomic updates with easy rollbacks
   - Ideal for edge computing, IoT devices, and container hosts
   - Quick updates that only address changes while keeping the OS unchanged

### Key Benefits
- **Consistency**: Standardized images across environments
- **Scalability**: Build and deploy images at enterprise scale
- **Security**: Controlled, auditable image creation process
- **Efficiency**: Automated image building and deployment workflows
- **Flexibility**: Support for various platforms and use cases

Image Builder is part of Red Hat's broader ecosystem for modern infrastructure management, particularly useful for organizations adopting DevOps practices, edge computing, or large-scale deployments.

## Where are these images typically used?

These custom operating system images are used in many different places where computers and servers run:

### Cloud Computing Platforms
- **Amazon Web Services** - Running virtual servers and applications in Amazon's cloud
- **Microsoft Azure** - Deploying systems in Microsoft's cloud platform
- **Google Cloud Platform** - Setting up servers and services on Google's cloud
- **Oracle Cloud Infrastructure** - Running workloads on Oracle's cloud services

### Traditional Data Centers and Servers
- **Physical servers** - Installing directly on bare metal hardware in company data centers
- **Virtual machines** - Running on virtualization platforms like VMware vSphere
- **Windows Subsystem for Linux** - Running Linux environments on Windows computers

### Edge and Remote Locations
- **Edge computing devices** - Small computers at remote locations like retail stores, factories, or cell towers
- **Internet of Things devices** - Smart devices and sensors that need a reliable operating system
- **Remote offices** - Branch locations that need standardized, secure computer systems

### Development and Testing
- **Developer workstations** - Providing consistent environments for software development
- **Testing environments** - Creating identical systems for quality assurance and testing
- **Container platforms** - Base images for running applications in containers

### Special Use Cases
- **Kiosks and point-of-sale systems** - Retail and service locations needing locked-down, reliable systems
- **Industrial automation** - Manufacturing and process control systems
- **Educational institutions** - Schools and universities needing standardized computer labs
- **Government and compliance environments** - Organizations requiring specific security and compliance configurations

The main advantage is that these images provide a consistent, secure, and pre-configured starting point for any type of computer system, whether it's running in the cloud, in a traditional data center, or at the edge of the network.
