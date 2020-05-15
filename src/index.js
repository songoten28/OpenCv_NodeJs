const Util = require("./Util")

const LMark = require("./LMark")

const cv = require('opencv4nodejs');

const _ = require('lodash')
// empty Mat
// console.log(process.cwd())
const mat = cv.imread('./src/a.png');

//tạo ni để drawcontour cho test
const mat3 = new cv.Mat(3289, 2542, cv.CV_8UC3);
const mat4 = new cv.Mat(3289, 2542, cv.CV_8UC3);

// cv.imwrite("./b.png", mat2)


const removeNoise = (mat) => {
    const sigma = _.min(mat.sizes) * (5.6569e-4)
    let ksize = new cv.Size(0, 0);
    const dst0 = mat.gaussianBlur(ksize, sigma, 0);

    return dst0
    // return result
}
const threshold = (math) => {
    const gray_image = math.cvtColor(cv.COLOR_BGR2GRAY) //convert to gray
    const result = gray_image.threshold(128, 255, cv.THRESH_BINARY | cv.THRESH_OTSU)

    return result
}

const detect_edges = (mat) => {
    const low_threshold = 100
    return mat.canny(low_threshold, low_threshold * 3, 3, false)
}

const polygon_to_clockwise = (polygon) => {
    //TODO     """Returns the given polygon in clockwise direction."""
    // console.log(JSON.stringify(polygon) + " -----")
    // const clockwise = cv.contourArea(polygon, true) >= 0
    // if (clockwise)
    //     return polygon
    // else
    //     return list(reversed(polygon))
    return polygon
}

const approx_poly = (contour) => {
    //chu vi
    const perimeter = contour.arcLength(true)
    //https://github.com/justadudewhohacks/opencv4nodejs/pull/350
    const simple = contour.approxPolyDPContour(0.05 * perimeter, true)
    // const polygon = contour_to_polygon(simple)
    //console.log('simple la 1 object contour')
    return polygon_to_clockwise(simple)
}

const find_polygons = (mat) => {
    //Find 4 điểm đánh dấu ở góc

    //Cái này đảo ngược màu
    const edges = detect_edges(mat)
    // cv.imwrite("./src/dao_nguoc_mau.png", edges)

    //Tim duong vien
    const contours = edges.findContours(cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)

    // Util.drawContour(contours, "drawAfterFindContours")

    let polygons = []
    for (let i = 0; i < contours.length; i++) {
        polygons.push(approx_poly(contours[i]))
    }

    return polygons
}

const processingImageCorner = (polygons) => {
    //tìm 4 điẻm ở góc
    let hexagons = []; // 6 canh
    let quadrilaterals = []; //4 canh
    for (let poly of polygons) {
        if (poly.numPoints === 6) {
            hexagons.push(poly)
        } else if (poly.numPoints === 4) {
            quadrilaterals.push(poly)
        }
    }

    // mỗi hex là 1 hình
    for(let hex of hexagons){
        LMark(hex)
        try{

        }catch (e) {
            //Wrong shape
        }
    }
    // Util.drawContour(quadrilaterals, "quadrilaterals")
    // Util.drawContour(hexagons, "hexagons")

}


const processImage = (mat) => {
    //remove noise and threshold preparing image
    const image_pro = threshold(removeNoise(mat))
    //find polygon
    const polygons = find_polygons(image_pro)
    processingImageCorner(polygons)

    //dilate image  : hiển thị nổi bật vùng đc tô
    const dilated = image_pro.dilate(
        cv.getStructuringElement(cv.MORPH_DILATE, new cv.Size(3, 3)),
        new cv.Point(-1, -1),
        1
    );

    //Processing detect

    cv.imwrite("./src/dilated.png", dilated)
}

processImage(mat)

var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;

function getParamNames(func) {
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    if (result === null)
        result = [];
    return result;
}
