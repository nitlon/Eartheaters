setwd('/Users/hannah/Dropbox/Westneat_Lab/Eartheater Project/Data/Dissection_photos/EBL/Lateral_dig/Coordinates/')

coorddir <- dir('./', pattern='*.csv')


# classifiers <- read.csv('/Users/hannah/Dropbox/Westneat Lab/Eartheater Project/Data/MorphoJ_files/classifiers.csv', sep=
#                           '\t')

points <- 46

finalfile <- matrix(0, nrow=length(coorddir), ncol=points*2)
for (i in 1:length(coorddir)) {
  coordfile <- read.csv2(coorddir[i], sep=',', header=T)
  newcoords <- as.matrix(coordfile[,3:4])
  vectorcoords <- as.numeric(as.vector(t(newcoords)))
  finalfile[i,] <- vectorcoords
}



# in case you give up like a weakling and want to use morphoj after all
finalfile <- as.data.frame(finalfile, row.names = substr(coorddir, 1, 17), col.names=FALSE)

write.csv(finalfile, '/Users/hannah/Dropbox/Westneat_Lab/Eartheater Project/Data/MorphoJ_files/12-13-2016_EBL.csv')
