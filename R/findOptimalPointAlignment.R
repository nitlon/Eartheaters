findOptimalPointAlignment <- function(m1, m2){
	
	# IF INPUTTING A MATRIX WITH ALL ZEROS IN ONE DIMENSION, MAKE IT M2, NOT M1

	# SET INITIAL COMMON POINT MATRIX VALUES
	m1o <- m1
	m2o <- m2

	# REPLACE NON-COMMON LANDMARKS BETWEEN TWO MATRICES WITH NA
	m1o[which(is.na(m2))] <- NA
	m2o[which(is.na(m1))] <- NA

	# CENTER M2 ABOUT CENTROID OF COMMON POINTS
	m2c <- m2 - matrix(colMeans(m2o, na.rm=TRUE), nrow=nrow(m2o), ncol=ncol(m2o), byrow=TRUE)

	# CENTER COMMON POINTS
	m1oc <- scale(m1o, center=TRUE, scale=FALSE)
	m2oc <- scale(m2o, center=TRUE, scale=FALSE)

	# FIND ROTATION MATRIX TO APPLY TO M2 THAT MINIMIZES DISTANCE BETWEEN M1 AND M2
	SVD <- svd(t(na.omit(m1oc)) %*% na.omit(m2oc))
	L <- diag(SVD$d)
	S <- ifelse(L<0, -1, L)
	S <- ifelse(L>0, 1, L)

	## NEW ADDITION - WAS GIVING ZERO AT 3,3 BEFORE
	#S[3,3] <- 1
	# DOES NOT WORK

	# GET ROTATION MATRIX
	# MIGHT CHANGE POINTS RELATIVE TO ONE ANOTHER (VERY SLIGHTLY)
	# I THINK IT ONLY HAPPENS WHEN ONE DIMENSION OF M1 IS ALL ZEROS
	# CAUSES PROBLEM IN DETERMINING FIT PERHAPS
	RM <- SVD$v %*% S %*% t(SVD$u)

	# ROTATE ALL CENTER LANDMARKS IN M2
	m2r <- m2c %*% RM

	# APPLY TRANSLATION PARAMETERS
	m2r <- m2r + matrix(colMeans(m1o, na.rm=TRUE), nrow=nrow(m2r), ncol=ncol(m2r), byrow=TRUE)

	m2r
}