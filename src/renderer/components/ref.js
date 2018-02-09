
// 利用Webpack的 require.context
import Vue from "vue";
const path = require("path");

let components = {},
    reg = /.vue$/g,
    addlist = ["LandingPage"];

function importAll(r) {
    r.keys().map(function (t) {
        var k = t.replace(reg, ''),
            index = k.indexOf('./'),
            j = k.substring(index + 2);
        if (!addlist.includes(j)) {
            components[j] = require('./' + j + '.vue').default;
            Vue.component(j, components[j])
        }
    });
}

importAll(require.context("../components/", false, /.vue$/))

