function frames25_fixed(clipfoldername, stepsize)
jpgdir = dir([clipfoldername,'/*.jpg']);
destination = sprintf('%s%s%s%s', clipfoldername, '_', num2str(stepsize), 'FrameIntervals');

if ~exist(destination)
    mkdir(destination);
end

k = 1;
while k <= length (jpgdir)
    copyfile([clipfoldername, '/', jpgdir(k).name,], [destination, '/', jpgdir(k).name]);
    k = k+stepsize;
end

end