let arr = [ '001.001.001', '002.001.001', '002.002.002', '003.001.001' ];
let q = "";
let q1 = "( '001.001.001', '002.001.001', '002.002.002', '003.001.001' )"
arr.map(item => {
    q+= "'" + item + "'" + ",";
});
q = q.slice(0,-1);
q = "(" + q + ")";




console.log("arr:",arr);
console.log("q:",q);
console.log("q1:",q1);

console.log("typeof arr:",typeof(arr));
console.log("typeof q:",typeof(q));
console.log("typeof q1:",typeof(q1));

