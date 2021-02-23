/* This file is automatically rebuilt by the Cesium build process. */
define(['./when-e6985d2a', './Check-24cae389', './Math-392d0035', './Cartesian2-2053506a', './Transforms-3b84d73e', './RuntimeError-61701d3e', './WebGLConstants-34c08bc0', './ComponentDatatype-cb08e294', './GeometryAttribute-d8aa2728', './GeometryAttributes-d6ea8c2b', './AttributeCompression-b8eafb9a', './GeometryPipeline-5b18a325', './EncodedCartesian3-84ba86ab', './IndexDatatype-1be7d1f8', './IntersectionTests-2d8c9291', './Plane-4ef9e8c1', './GeometryOffsetAttribute-9c46b133', './VertexFormat-2df57ea4', './EllipseGeometryLibrary-79f9ab1a', './GeometryInstance-bea95b9f', './EllipseGeometry-d1698e91'], function (when, Check, _Math, Cartesian2, Transforms, RuntimeError, WebGLConstants, ComponentDatatype, GeometryAttribute, GeometryAttributes, AttributeCompression, GeometryPipeline, EncodedCartesian3, IndexDatatype, IntersectionTests, Plane, GeometryOffsetAttribute, VertexFormat, EllipseGeometryLibrary, GeometryInstance, EllipseGeometry) { 'use strict';

  function createEllipseGeometry(ellipseGeometry, offset) {
    if (when.defined(offset)) {
      ellipseGeometry = EllipseGeometry.EllipseGeometry.unpack(ellipseGeometry, offset);
    }
    ellipseGeometry._center = Cartesian2.Cartesian3.clone(ellipseGeometry._center);
    ellipseGeometry._ellipsoid = Cartesian2.Ellipsoid.clone(ellipseGeometry._ellipsoid);
    return EllipseGeometry.EllipseGeometry.createGeometry(ellipseGeometry);
  }

  return createEllipseGeometry;

});
