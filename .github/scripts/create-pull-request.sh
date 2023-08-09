BRANCH_NAME=shared-context-dist-$(date +%s)
PROJECT_NAME=shared-context
REPO_NAME=$1
GH_USER_NAME=$2
GH_USER_EMAIL=$3

echo "BRANCH_NAME: $BRANCH_NAME"
echo "REPO_NAME: $REPO_NAME"
echo "PROJECT_NAME: $PROJECT_NAME"
echo "GH_USER_NAME: $GH_USER_NAME"
echo "GH_USER_EMAIL: $GH_USER_EMAIL"

cd $REPO_NAME
git branch $BRANCH_NAME
git checkout $BRANCH_NAME
cd ..
rm -rf $REPO_NAME/external_modules/$PROJECT_NAME
mkdir $REPO_NAME/external_modules
mkdir $REPO_NAME/external_modules/$PROJECT_NAME
cp -rf dist/* $REPO_NAME/external_modules/$PROJECT_NAME
echo "list distribution folder"
ls -lrt dist/*
cd $REPO_NAME
git config user.name $GH_USER_NAME
git config user.email $GH_USER_EMAIL
git add .
git commit -m "Generate new $PROJECT_NAME dist"
git push origin $BRANCH_NAME
gh pr create --base master --title "New $PROJECT_NAME distribution" --body "New declaration generated and ready to be merged to master"