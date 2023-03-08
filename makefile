IMAGE_REG ?= ghcr.io
IMAGE_REPO ?= pai-pai/anno-items-app
IMAGE_TAG ?= latest

image:
	docker build . --file Dockerfile \
	--tag $(IMAGE_REG)/$(IMAGE_REPO):$(IMAGE_TAG)