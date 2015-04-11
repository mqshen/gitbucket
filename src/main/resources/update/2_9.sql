CREATE TABLE IF NOT EXISTS `COMMIT`(
    `USER_NAME` VARCHAR(100) NOT NULL,
	`REPOSITORY_NAME` VARCHAR(100) NOT NULL,
	`COMMIT_ID` VARCHAR(100) NOT NULL,
	`COMMIT_USER_NAME` VARCHAR(100) NOT NULL,
	PRIMARY KEY (`USER_NAME`, `REPOSITORY_NAME`, `COMMIT_ID`)
);