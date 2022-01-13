export interface Point {
    x: number;
    y: number;
}

function MakeSlope(source: Point, target: Point): number {
    return (source.y - target.y) / (source.x - target.x);
}

function FindArcPoint(source: Point, target: Point, radius: number): Point {
    const eqTop: number = radius * (source.x - target.x);
    const eqBottom: number = Math.sqrt(Math.pow(source.x - target.x, 2) + Math.pow(source.y - target.y, 2));
    const x: number = eqTop / eqBottom + target.x;

    let y: number;
    if (source.x === target.x) {
        if (source.y > target.y) {
            y = target.y + radius;
        } else {
            y = target.y - radius;
        }
    } else {
        const slope: number = MakeSlope(source, target);
        y = slope * (x - source.x) + source.y;
    }

    return { x, y };
}

function GetArcSweepFlag(arcOrigin: Point, centerPoint: Point, slope: number): string {
    if ((arcOrigin.y - centerPoint.y) - slope * (arcOrigin.x - centerPoint.x) > 0) {
        return slope > 0 ? ' 1' : ' 0';
    } else {
        return slope > 0 ? ' 0' : ' 1';
    }
}

function MakeArc(arcOrigin: Point, arcEnd: Point, centerPoint: Point, radius: number): string {
    if (arcOrigin.x === arcEnd.x || arcOrigin.y === arcEnd.y) {
        return ` L${ arcEnd.x },${ arcEnd.y }`;
    }

    let arc: string = ` A${ radius },${ radius } 0 0`;
    const slope: number = MakeSlope(arcOrigin, arcEnd);
    arc += GetArcSweepFlag(arcOrigin, centerPoint, slope);

    arc += ` ${ arcEnd.x },${ arcEnd.y }`;
    return arc;
}

export function CreatePath(points: Point[], edgeCurveRadius: number = 0): string {
    const firstPoint: Point = points[0];
    let path: string = `M${ firstPoint.x },${ firstPoint.y }`;
    for (let i: number = 1; i < points.length - 1; i++) {
        const previousPoint: Point = points[i - 1];
        const currentPoint: Point = points[i];
        const nextPoint: Point = points[i + 1];
        const arcOriginPoint: Point = FindArcPoint(previousPoint, currentPoint, edgeCurveRadius);
        const arcEndPoint: Point = FindArcPoint(nextPoint, currentPoint, edgeCurveRadius);
        path += ` L${ arcOriginPoint.x },${ arcOriginPoint.y }`;
        path += MakeArc(arcOriginPoint, arcEndPoint, currentPoint, edgeCurveRadius);
    }

    const lastPoint: Point = points[points.length - 1];
    path += ` L${ lastPoint.x },${ lastPoint.y }`;

    return path;
}
