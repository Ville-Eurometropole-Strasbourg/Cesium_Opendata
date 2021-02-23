/* This file is automatically rebuilt by the Cesium build process. */
define(['./when-e6985d2a', './Check-24cae389', './Math-392d0035', './Cartesian2-2053506a', './Transforms-3b84d73e', './RuntimeError-61701d3e', './WebGLConstants-34c08bc0', './ComponentDatatype-cb08e294', './GeometryAttribute-d8aa2728', './GeometryAttributes-d6ea8c2b', './IndexDatatype-1be7d1f8', './GeometryOffsetAttribute-9c46b133', './VertexFormat-2df57ea4', './CylinderGeometryLibrary-09101d37', './CylinderGeometry-7cb45781'], function (when, Check, _Math, Cartesian2, Transforms, RuntimeError, WebGLConstants, ComponentDatatype, GeometryAttribute, GeometryAttributes, IndexDatatype, GeometryOffsetAttribute, VertexFormat, CylinderGeometryLibrary, CylinderGeometry) { 'use strict';

  function createCylinderGeometry(cylinderGeometry, offset) {
    if (when.defined(offset)) {
      cylinderGeometry = CylinderGeometry.CylinderGeometry.unpack(cylinderGeometry, offset);
    }
    return CylinderGeometry.CylinderGeometry.createGeometry(cylinderGeometry);
  }

  return createCylinderGeometry;

});
