const _ = require('lodash')
const Util = require("./Util")

const MathUtil = require('./MathUtil')
const average = (values) => {
    return _.sum(values) / values.length
}

const calc_2d_dist = (pointA, pointB) => {

    const x = Math.pow((pointA.x - pointB.x), 2);
    const y = Math.pow((pointA.y - pointB.y), 2);
    return Math.sqrt(x + y)
}

const prev_index = (points, index) => {
    if (index - 1 >= 0) {
        return index - 1
    } else {
        return points.length - 1
    }
}

const next_indext = (points, index) => {
    if (index + 1 < points.length) {
        return index + 1
    } else {
        return 0
    }
}

const calc_angle = (prev, current, next) => {
    const mag_a = calc_2d_dist(prev, current);
    const mag_b = calc_2d_dist(current, next);
    const a_b = calc_2d_dist(prev, next);

    const cosine = (Math.pow(mag_a, 2) + Math.pow(mag_b, 2) - Math.pow(a_b, 2)) / (2 * mag_a * mag_b)
    //TODO ROUND
    const angle = Math.abs(Math.acos(Math.round(cosine))) * 180 / Math.PI
    //angle in radians
    // var resultRadian = Math.acos(((Math.pow(p12, 2)) + (Math.pow(p13, 2)) - (Math.pow(p23, 2))) / (2 * p12 * p13));

//angle in degrees
//     var resultDegree = Math.acos(((Math.pow(p12, 2)) + (Math.pow(p13, 2)) - (Math.pow(p23, 2))) / (2 * p12 * p13)) * 180 / Math.PI;

    return angle <= 180 ? angle : angle - 180
}

const calc_corner_angles = (polygon) => {
    //T sẽ tính góc của 6 point đối với shape có hexa
    const points = polygon.getPoints();
    const angle_result = []
    for (let i = 0; i < points.length; i++) {
        const prev_point = points[prev_index(points, i)]
        const next_point = points[next_indext(points, i)]
        angle_result.push(calc_angle(prev_point, points[i], next_point))
    }
    return angle_result
}

const is_approx_equal = (value_a, value_b, tolerance) => {
    // gia tri thuc a, gia tri mong muon b, bien do
    //    """Returns true if the difference of `a` and `b` is within tolerance * value_b."""
    // value b MATH.PI/2 => quanh quẩn 90 độ
    return Math.abs(value_a - value_b) <= (tolerance * value_b)
}

// = (Math.PI / 2)
const all_approx_equal = (values, target, tolerance = 0.15) => {
    // """Returns `True` if every element in `values` is within `tolerance` of `target`.
    //
    //     Args:
    //         values: List of numeric values to check for equality.
    //         target: Target value. If not provided, uses the mean to check if all list
    //         are approximately equal to themselves.
    //         tolerance: The tolerance for equality. 0.1 is 10% of the smaller value."""
    let target_ = average(values)
    if (target) {
        target_ = target
    }

    //Return True if bool(x) is True for all values x in the iterable.
    return values.every(value => is_approx_equal(value, target_, tolerance))
}


const all_approx_square = (contour) => {
    //Lấy tường góc trong shape
    const angles = calc_corner_angles(contour)
    //tính tương đối lẹch 0 đág kể vẫn OK
    return all_approx_equal(angles, 90)
}

module.exports = LMark = (polygon) => {
    //"""Returns true if every angle in `contour` is approximately right
    //     (90deg)."""
    if (!all_approx_square(polygon)) {
        return
    }
    //Tinh cac canh ben array [69,45,23...]
    console.log('tinh canh ben ----------------')
    const side_lengths = calc_side_lengths(polygon)
    console.log('polygon', polygon.getPoints(), "-----", side_lengths)

    //index array [4,6,8 ,...]
    console.log('Tính và tìm index cạnh dài nhất ---- ')
    const longest_sides_indexes = find_greatest_value_indexes(side_lengths, 2)
    console.log('find by index', longest_sides_indexes)
    if (!is_adjacent_indexes(side_lengths, longest_sides_indexes[0], longest_sides_indexes[1])) {
        console.log('Các cạnh dài nhất không liền kề nhau, Longest sides are not adjacent.')
        return
    }
    console.log('canh dai nhat phai gap doi canh con lai')
    //canh phai dai gap doi cach con lai
    if (!divide_some(side_lengths, longest_sides_indexes, 2)) {
        console.log('ko dc roi')
        return
    }
    console.log('on thoa')
    const sort = MathUtil.moveItemBecomeFirst(polygon.getPoints(), longest_sides_indexes)
    console.log('sort ', sort)
    Util.drawContour([polygon], "polygon")

}

const divide_some = (side_lengths, longest_sides_indexes, divisor) => {
    console.log('find by index', longest_sides_indexes)

    for (const longest of longest_sides_indexes) {
        for (let i = 0; i < side_lengths.length; i++) {
            if (i !== parseInt(longest_sides_indexes[0]) && i !== parseInt(longest_sides_indexes[1])) {
                if (!all_approx_equal([parseFloat(side_lengths[longest]) / side_lengths[i]], 2,)) {
                    return false
                }
            }
        }
    }

    return true
}

const calc_side_lengths = (contour) => {
    const points = contour.getPoints();
    const result = []
    for (let index = 0; index < points.length; index++) {
        const next_point = points[next_indext(points, index)]
        result.push(calc_2d_dist(points[index], next_point))
    }

    return result
}

const find_greatest_value_indexes = (side_lengths, numberNeedToGet) => {
    console.log('side side_lengths', side_lengths)
    // var test = [98, 11,111, 32];
    let len = side_lengths.length;
    let indices = new Array(len);
    for (let i = 0; i < len; ++i) indices[i] = i;
    indices.sort(function (a, b) {
        return side_lengths[a] < side_lengths[b] ? -1 : side_lengths[a] > side_lengths[b] ? 1 : 0;
    });

    const reverse = _.reverse(indices);
    //Returns:
    //         A list where the first element is the index of the greatest item and the
    //         second element is the index of the second-greatest item and so on.
    return _.take(reverse, numberNeedToGet)
}


const is_adjacent_indexes = (items, index_a, index_b) => {
    return next_indext(items, index_a) === index_b || prev_index(
        items, index_a) === index_b
}
