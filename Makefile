BUILD_DIR := ./dist
PROD_REPO = ssh://plindner@housuggest.org/~/terry2015.git
STAGING_REPO = ssh://plindner@housuggest.org/~/terrytest.git

# Deploy tasks
staging: clean build git-staging deploy
	@ git tag -f staging
	@ echo "Staging deploy complete"


prod: clean build git-prod deploy
	@ git tag -f production 
	@ echo "Production deploy complete"

# Build tasks

build: 
	@ find www/ -name ".DS_Store" -depth -exec rm {} \;
	@ cp -R www/ $(BUILD_DIR) && \
	rm -rf $(BUILD_DIR)/lib

# Sub-tasks

clean:
	@ rm -rf $(BUILD_DIR)

git-prod:
	@ cd $(BUILD_DIR) && \
	git init && \
	git remote add origin $(PROD_REPO)

git-staging:
	@ cd $(BUILD_DIR) && \
	git init && \
	git remote add origin $(STAGING_REPO)

deploy:
	@ cd $(BUILD_DIR) && \
	git add -A && \
	git commit -m "fixes Jan 21" && \
	git push -f origin +master:refs/heads/master

.PHONY: build clean deploy git-prod git-staging prod staging
