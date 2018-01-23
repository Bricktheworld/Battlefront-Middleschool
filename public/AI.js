//I didn't make any of this AI code cus I'm not smart
function facePoint(rotatingObject, pointToRotateTo) {

  // a directional vector from one object to the other one
  var direction = pointToRotateTo.subtract(rotatingObject.position);
  var distanceToTargetPoint = direction.length();

  if (distanceToTargetPoint > 0.5) {

    var axisVectorY = new BABYLON.Vector3(0, 0, 1);
    var directionAxisForY = 'x';
    var deltaY = calculateRotationDeltaForAxis(rotatingObject, 'y', axisVectorY, direction, directionAxisForY);

    var axisVectorZ = new BABYLON.Vector3(0, 1, 0);
    var directionAxisForZ = 'z';
    var deltaZ = calculateRotationDeltaForAxis(rotatingObject, 'z', axisVectorZ, direction, directionAxisForZ);

    var turnAroundYAxisDone = applyRotationForAxis(rotatingObject, 'y', deltaY);
    var turnAroundZAxisDone = applyRotationForAxis(rotatingObject, 'z', deltaZ);

    return (turnAroundYAxisDone && turnAroundZAxisDone) ? true : false;

  }
}

function faceTarget(rotatingObject, target) {
  return facePoint(rotatingObject, target.position);
}

function calculateRotationDeltaForAxis(rotatingObject, axis, axisVector, direction, directionAxis) {
  var axisVectorNormalized = axisVector.normalize();
  var directionVectorNormalized = direction.normalize();

  // calculate the angel for the new direction
  var angle = Math.acos(BABYLON.Vector3.Dot(axisVectorNormalized, directionVectorNormalized));

  if (directionAxis == 'x') {
    // decide it the angle has to be positive or negative
    if (direction[directionAxis] < 0) angle *= -1;
    // compensate initial rotation of imported spaceship mesh
  } else {
    angle -= Math.PI / 2;
  }

  // calculate both angles in degrees
  var playerRotationOnAxis = rotatingObject.rotation[axis];
  // calculate and return the delta
  return playerRotationOnAxis - angle;
}

function applyRotationForAxis(rotatingObject, axis, delta) {
  var pi = Math.PI;

  // check what direction to turn to take the shortest turn
  if (delta > pi) {
    delta -= pi * 2;
  } else if (delta < -pi) {
    delta += pi * 2;
  }

  var absDelta = Math.abs(delta);
  // rotate until the difference between the object angle and the target angle is no more than 3 degrees
  if (absDelta > 0.0349066) {

    var rotationSpeed = Math.max(0.2, Math.min(absDelta * absDelta, 1));

    if (delta > 0) {
      rotatingObject.rotation[axis] -= rotationSpeed * 0.02;
      if (rotatingObject.rotation[axis] < -pi) {
        rotatingObject.rotation[axis] = pi;
      }
    }
    if (delta < 0) {
      rotatingObject.rotation[axis] += rotationSpeed * 0.02;
      if (rotatingObject.rotation[axis] > pi) {
        rotatingObject.rotation[axis] = -pi;
      }
    }

  }
  if (absDelta <= 0.261799) {
    // turn done
    return true;
  }
}
