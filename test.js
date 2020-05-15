const items = ['a','b', 'c', '6', '7']

const next_indext = (points, index) => {
    if (index + 1 < points.length) {
        return index + 1
    } else {
        return 0
    }
}

const index = 4

const result = [items[index]]
let i = next_indext(items, index)

while (i !== index){
    result.push(items[i])
    i = next_indext(items, i)
}

console.log('ressult', result)

