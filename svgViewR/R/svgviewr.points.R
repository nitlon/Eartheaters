svgviewr.points <- function(x, file=NULL, y=NULL, type="p", col=NULL, col.fill="black", 
	col.stroke="black", z.index=0, layer="", label="", cex=2, lwd=2, opacity.stroke=1, 
	opacity.fill=1, append=TRUE, tag.name="point"){

	# IF Y IS NON-NULL, ADD AS SECOND COLUMN TO X
	if(!is.null(y)) x <- cbind(x, y)

	# IF POINT COORDINATES ARE VECTOR SET AS MATRIX
	if(is.vector(x)) x <- matrix(x, nrow=1, ncol=length(x))

	# SUPRESS EXPONENTIAL FORMAT FOR NEARLY ZERO VALUES (CANNOT BE READ BY SVG READER)
	options(scipen=10)
	x <- round(x, 8)

	# EMPTY NEW LINES
	new_lines <- rep(NA, dim(x)[1])

	# IF POINTS ARE MATRIX, MAKE INTO AN ARRAY
	if(length(dim(x)) == 2) x <- array(x, dim=c(dim(x), 1))

	# IF SECOND DIMENSION IS OF LENGTH TWO, ADD THIRD DIMENSION OF ZEROS
	if(dim(x)[2] == 2){
		xn <- array(NA, dim=c(dim(x)[1], 3, dim(x)[3]))
		for(i in 1:dim(x)[3]){
			if(is.matrix(x[, , i])){
				xn[, , i] <- cbind(x[, , i], rep(0, nrow(x[, , i])))
			}else{
				xn[, , i] <- c(x[, , i], 0)
			}
		}
		x <- xn
	}

	# IF COL IS SPECIFIED, OVERWRITE FILL AND STROKE
	if(!is.null(col)){col.fill <- col;col.stroke <- col}

	# SET GRAPHICAL PARAMETERS
	svg_gp <- c("col", "col.fill", "col.stroke", "label", "layer", "opacity.fill", 
		"opacity.stroke", "cex", "lwd", "z.index")

	# CONVERT GRAPHICAL PARAMETERS TO VECTORS WITH SAME NUMBER OF ELEMENTS OF FIRST X DIMENSION
	for(gpar in svg_gp){
		if(length(get(gpar)) < dim(x)[1]){
			assign(gpar, rep(get(gpar), dim(x)[1]))
		}else if(length(get(gpar)) > dim(x)[1]){
			assign(gpar, paste(get(gpar), collapse=","))
		}
	}

	cp <- ""
	if(tag.name == "circle") cp <- "c"

	# WRITE POINTS TO SVG STRUCTURE
	for(i in 1:dim(x)[1]){

		# COLLAPSE VALUES INTO COMMA-SEPARATED STRING
		xc <- paste(x[i, 1, ], collapse=",")
		yc <- paste(x[i, 2, ], collapse=",")
		zc <- paste(x[i, 3, ], collapse=",")

		# CHECK THAT POINTS CHANGE POSITION BEFORE PRINTING ANIMATION STRING
		sum_sd <- 0
		if(is.matrix(x[i, , ])){
			sum_sd <- sum(apply(matrix(x[i, , ], ncol=3, byrow=T), 2, sd))
		}else{
		}
		if(!is.na(sum_sd) && sum_sd == 0){
			xc <- x[i, 1, 1]
			yc <- x[i, 2, 1]
			zc <- x[i, 3, 1]
		}

		new_lines[i] <- paste("\t<", tag.name, " z-index=\"", z.index[i], "\" layer=\"", layer[i], 
			"\" ", cp, "x=\"", xc, "\" ", cp, 
			"y=\"", yc, "\" ", cp, 
			"z=\"", zc, 
			"\" label=\"", label[i], "\" r=\"", cex[i], "\" stroke=\"", col.stroke[i], 
			"\" stroke-width=\"", lwd[i], "\" fill=\"", col.fill[i], "\" fill-opacity=\"", opacity.fill[i], 
			"\" stroke-opacity=\"", opacity.stroke[i], "\" ></", tag.name, ">", sep="")
	}

	# REMOVE SCIENTIFIC NOTATION
	options(scipen=0)

	# REMOVE NA LINES
	new_lines <- new_lines[!is.na(new_lines)]

	# IF FILE IS NULL, RETURN LINES OF SVG OBJECTS
	if(is.null(file)) return(new_lines)

	# SAVE NEW LINES TO FILE
	svgviewr.write(new_lines, file, append=append)
}