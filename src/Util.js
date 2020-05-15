

const cv = require('opencv4nodejs');

const _ = require('lodash')

//craeate black color

const drawContour  = (contours, name = "no_name") => {
    //draw image with duong vien mau vang
    const color = new cv.Vec3(41, 176, 218);
    const mat2 = new cv.Mat(3289, 2542, cv.CV_8UC3);

    //  Draw theo cach cu
    // for (let i of polygons) {
    //     mat2.drawContours([i], new cv.Vec3(Math.round(Math.random() * 255), Math.round(Math.random() * 255),
    //         Math.round(Math.random() * 255)), -1,);
    // }

    const sortContours = contours.sort((c0, c1) => c1.area - c0.area);
    const imgContours = sortContours.map((contour) => {
        return contour.getPoints();
    });
    mat2.drawContours(imgContours, -1, color, 2);
    cv.imwrite(`./src/${name}.png`, mat2)
}

exports.drawContour = drawContour;
