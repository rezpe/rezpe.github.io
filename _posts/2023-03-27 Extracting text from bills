---
title: Extracting text from Supermarket bills with Python, OpenCV and Keras-OCR
author: Sebas
date: 2023-03-27
layout: page
---

We are going to first scan the bills. This usually generates a pdf, which we need to convert into an image so we can start processing it.

```python
from pdf2image import convert_from_path

pages = convert_from_path("./Bills/2022_05_31_13_09_46.pdf")

for i in range(len(pages)):
  pages[i].save('page'+ str(i) +'.jpg', 'JPEG')
```

As the scanned bill has only 1 image, we read only the first and start cropping and resizing it:

```python
# import the necessary packages
import numpy as np
import argparse
import cv2
from google.colab.patches import cv2_imshow

# load the image from disk
image = cv2.imread("page0.jpg")

# Crop
# Y,X
margin = 100
crop_img = image[margin:-margin,margin:-margin]

# Resize
scale_percent = 50 # percent of original size
width = int(crop_img.shape[1] * scale_percent / 100)
height = int(crop_img.shape[0] * scale_percent / 100)
dim = (width, height)

res_img = cv2.resize(crop_img, dim, interpolation = cv2.INTER_AREA)
cv2_imshow(res_img)
image = res_img
```



We then convert to greyscale and rotate for easier processing

```python
# convert the image to grayscale and flip the foreground
# and background to ensure foreground is now "white" and
# the background is "black"
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
# Threshold
ret,gray = cv2.threshold(gray,150,255,cv2.THRESH_BINARY)

gray = cv2.bitwise_not(gray)
# threshold the image, setting all foreground pixels to
# 255 and all background pixels to 0
thresh = cv2.threshold(gray, 0, 255,
	cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]

# grab the (x, y) coordinates of all pixel values that
# are greater than zero, then use these coordinates to
# compute a rotated bounding box that contains all
# coordinates
coords = np.column_stack(np.where(thresh > 0))
angle = cv2.minAreaRect(coords)[-1]
# the `cv2.minAreaRect` function returns values in the
# range [-90, 0); as the rectangle rotates clockwise the
# returned angle trends to 0 -- in this special case we
# need to add 90 degrees to the angle
if angle < -45:
	angle = - angle
# otherwise, just take the inverse of the angle to make
# it positive
else:
	angle = 90-angle

# rotate the image to deskew it
(h, w) = image.shape[:2]
center = (w // 2, h // 2)
M = cv2.getRotationMatrix2D(center, angle, 1.0)
rotated = cv2.warpAffine(image, M, (w, h),
	flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)

# draw the correction angle on the image so we can validate it
#cv2.putText(rotated, "Angle: {:.2f} degrees".format(angle),
#	(10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
# show the output image
print("[INFO] angle: {:.3f}".format(angle))
cv2.imwrite('pagegood.jpg', rotated)
```

And finally, we extract the text with keras-ocr

```python
#Importing the library
import matplotlib.pyplot as plt
import keras_ocr

# keras-ocr will automatically download pretrained
# weights for the detector and recognizer.
pipeline = keras_ocr.pipeline.Pipeline()

# Get a set of three example images
images = ["pagegood.jpg"]

# Each list of predictions in prediction_groups is a list of
# (word, box) tuples.
prediction = pipeline.recognize(images)[0]
```

We can then see the extracted text with the code below:

```python
from PIL import Image, ImageDraw

im = Image.open('pagegood.jpg')
draw = ImageDraw.Draw(im)
for i,(word,coord) in enumerate(prediction):
  draw.rectangle((coord[0][0], coord[0][1], coord[2][0], coord[2][1]), fill=(0, 192, 192), outline=(255, 255, 255))
  draw.text((coord[0][0], coord[0][1]), word.encode('utf-8'))
```
