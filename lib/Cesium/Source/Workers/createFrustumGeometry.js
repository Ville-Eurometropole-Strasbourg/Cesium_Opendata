/* This file is automatically rebuilt by the Cesium build process. */
define(['./when-e6985d2a', './Check-24cae389', './Math-392d0035', './Cartesian2-2053506a', './Transforms-3b84d73e', './RuntimeError-61701d3e', './WebGLConstants-34c08bc0', './ComponentDatatype-cb08e294', './GeometryAttribute-d8aa2728', './GeometryAttributes-d6ea8c2b', './Plane-4ef9e8c1', './VertexFormat-2df57ea4', './FrustumGeometry-a14db549'], function (when, Check, _Math, Cartesian2, Transforms, RuntimeError, WebGLConstants, ComponentDatatype, GeometryAttribute, GeometryAttributes, Plane, VertexFormat, FrustumGeometry) { 'use strict';

  function createFrustumGeometry(frustumGeometry, offset) {
    if (when.defined(offset)) {
      frustumGeometry = FrustumGeometry.FrustumGeometry.unpack(frustumGeometry, offset);
    }
    return FrustumGeometry.FrustumGeometry.createGeometry(frustumGeometry);
  }

  return createFrustumGeometry;

});
