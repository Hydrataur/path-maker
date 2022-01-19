"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePath = void 0;
function MakeSlope(source, target) {
    return (source.y - target.y) / (source.x - target.x);
}
function FindArcPoint(source, target, radius) {
    var eqTop = radius * (source.x - target.x);
    var eqBottom = Math.sqrt(Math.pow(source.x - target.x, 2) + Math.pow(source.y - target.y, 2));
    var x = eqTop / eqBottom + target.x;
    var y;
    if (source.x === target.x) {
        if (source.y > target.y) {
            y = target.y + radius;
        }
        else {
            y = target.y - radius;
        }
    }
    else {
        var slope = MakeSlope(source, target);
        y = slope * (x - source.x) + source.y;
    }
    return { x: x, y: y };
}
function GetArcSweepFlag(arcOrigin, centerPoint, slope) {
    if ((arcOrigin.y - centerPoint.y) - slope * (arcOrigin.x - centerPoint.x) > 0) {
        return slope > 0 ? ' 1' : ' 0';
    }
    else {
        return slope > 0 ? ' 0' : ' 1';
    }
}
function MakeArc(arcOrigin, arcEnd, centerPoint, radius) {
    if (arcOrigin.x === arcEnd.x || arcOrigin.y === arcEnd.y) {
        return " L".concat(arcEnd.x, ",").concat(arcEnd.y);
    }
    var arc = " A".concat(radius, ",").concat(radius, " 0 0");
    var slope = MakeSlope(arcOrigin, arcEnd);
    arc += GetArcSweepFlag(arcOrigin, centerPoint, slope);
    arc += " ".concat(arcEnd.x, ",").concat(arcEnd.y);
    return arc;
}
function CreatePath(points, edgeCurveRadius) {
    if (edgeCurveRadius === void 0) { edgeCurveRadius = 0; }
    var firstPoint = points[0];
    var path = "M".concat(firstPoint.x, ",").concat(firstPoint.y);
    for (var i = 1; i < points.length - 1; i++) {
        var previousPoint = points[i - 1];
        var currentPoint = points[i];
        var nextPoint = points[i + 1];
        var arcOriginPoint = FindArcPoint(previousPoint, currentPoint, edgeCurveRadius);
        var arcEndPoint = FindArcPoint(nextPoint, currentPoint, edgeCurveRadius);
        path += " L".concat(arcOriginPoint.x, ",").concat(arcOriginPoint.y);
        path += MakeArc(arcOriginPoint, arcEndPoint, currentPoint, edgeCurveRadius);
    }
    var lastPoint = points[points.length - 1];
    path += " L".concat(lastPoint.x, ",").concat(lastPoint.y);
    return path;
}
exports.CreatePath = CreatePath;
