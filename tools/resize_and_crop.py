#!/sbin/python3
import os
import glob
import subprocess

num = 0
file_list = glob.glob(os.curdir + '/*.*')
for f in file_list:
    print("file : ", f)
    original_name = os.path.basename(f)
    cmd = 'convert "' + original_name + '" -resize "256x256^" -gravity center -crop 256x256+0+0 +repage ./256x256/' + str(num) + '.jpg'
    print(cmd)
    try:
        proc = subprocess.check_output(cmd, stderr=subprocess.STDOUT, shell=True)
    except subprocess.CalledProcessError as e:
        # There was an error - command exited with non-zero code
        error = str(e.output)
        msg = "ERROR: Error executing rsync on " + cmd + " " + error
        print(msg)
    num+=1
