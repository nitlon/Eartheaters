%% SO YOU HAVE A TON OF .AVI VIDEOS AND YOU DON'T KNOW WHAT TO DO WITH THEM

%% STEP ONE: find S/W/E times of videos and log them in Video_specs.xls
% then turn each .avi into a set of tiffs for storage
avidir = dir('*.avi');
for i = 2:length(avidir)
    savename = sprintf('%s%s', avidir(i).name(1:17), '_AllFrames');
    v = VideoReader(avidir(i).name);
    if ~exist(savename, 'dir')
        mkdir(savename);
    end
    k = 1;
    while v.CurrentTime < v.Duration
        img = readFrame(v);
        if k < 10
            filename = sprintf('%s%s%s%s%s', savename, '/Frame-000', num2str(k), savename, '.jpg');
        elseif k < 100
            filename = sprintf('%s%s%s%s%s', savename, '/Frame-00', num2str(k), savename, '.jpg');
        elseif k < 1000
            filename = sprintf('%s%s%s%s%s', savename, '/Frame-0', num2str(k), savename, '.jpg');
        else
            filename = sprintf('%s%s%s%s%s', savename, '/Frame-', num2str(k), savename, '.jpg');
        end
        imwrite(img, filename);
        k = k+1;
    end

end

%% STEP TWO: turn .avi videos into tiff frames and store them according to phase
% making all the suction/winnowing/ejection folders
% gen. rule: for suction/ejection, take every 5 frames
% for winnowing: take every 15 frames
[num, txt, raw] = xlsread('Video_specs.xls');

% SD3
for i = 33:54
    videoname = sprintf('%s%s%s', raw{i, 1}, '_', raw{i, 3}(1:2));
    savename = sprintf('%s%s%s%s%s', raw{i, 4}, '_', raw{i, 1}, '_', raw{i, 3});
    if strcmp(raw{i, 4}, 'S') == 1
        avi2tiff([videoname, '_01-30-2016_C001H001S0001.avi'], raw{i,5}, raw{i,6}, savename);
    elseif strcmp(raw{i, 4}, 'W') == 1
        avi2tiff([videoname, '_01-30-2016_C001H001S0001.avi'], raw{i,5}, raw{i,6}, savename);
    elseif strcmp(raw{i,4}, 'E') == 1
        avi2tiff([videoname, '_01-30-2016_C001H001S0001.avi'], raw{i,5}, raw{i,6}, savename);
    end
end

%% STEP THREE: make intervals folders
Wdir15 = dir('W_*');
for i = 1:length(Wdir15)
    frames_fixed(Wdir15(i).name, 15)
end

Sdir5 = dir('S_*');
for i = 1:length(Sdir5)
    frames_fixed(Sdir5(i).name, 5)
end

Edir5 = dir('E_*');
for i = 1:length(Edir5)
    frames_fixed(Edir5(i).name, 5)
end


%% STEP FOUR: make shapes folders

ohdir = dir('*Intervals');
for i = 1:length(ohdir)
    newname = sprintf('%s%s%s','../Shapes/', ohdir(i).name(1:end-9), 'Shapes');
    if ~exist(newname)
        mkdir(newname)
    end
end


%%
newdir = dir('*_10FrameIntervals');
for i = 1:length(newdir)
    source = newdir(i).name;
    destination = sprintf('%s%s', '/Users/hannah/Dropbox/Westneat Lab/Eartheater Project/Data/Videos/SD1/01-15-16/', newdir(i).name);
    copyfile(source, destination);
end