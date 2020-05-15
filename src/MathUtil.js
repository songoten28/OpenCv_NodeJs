const next_index = (points, index) => {
    if (index + 1 < points.length) {
        return index + 1
    } else {
        return 0
    }
}

const determineWhichIsNext = (items, index_a, index_b) => {
    if(next_index(items, index_a) === index_b){
        return index_b
    }

    return index_a
}

exports.moveItemBecomeFirst = (items, longSides) => {
    const index = determineWhichIsNext(items, longSides[0], longSides[1])
    const result = [items[index]]
    let i = next_index(items, index)

    while (i !== index){
        result.push(items[i])
        i = next_index(items, i)
    }

    return result
}
