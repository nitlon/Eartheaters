setwd('/Users/hannah/Dropbox/Westneat_Lab/Eartheater Project/Data/Videos/Cranial Elevation Check/')
angles <- read.csv('Angles.csv')
change <- c((angles$During.strike-angles$Before.strike), (angles$During.strike-angles$After.strike))
mean(angles$During.strike-angles$Before.strike)
sd(angles$During.strike-angles$Before.strike)
hist(change)
