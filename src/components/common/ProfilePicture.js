import React from 'react';
import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from '@cloudinary/url-gen';

// Import required actions and qualifiers.
import { thumbnail } from '@cloudinary/url-gen/actions/resize';
import { byRadius } from '@cloudinary/url-gen/actions/roundCorners';
import { focusOn } from '@cloudinary/url-gen/qualifiers/gravity';
import { FocusOn } from '@cloudinary/url-gen/qualifiers/focusOn';

export default function ProfilePicture({ cloudinaryImageId, size }) {
  // Create and configure your Cloudinary instance.
  const cld = new Cloudinary({
    cloud: {
      cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME
    }
  });

  // Use the image with public ID, 'front_face'.
  const myImage = cld.image(
    cloudinaryImageId ? cloudinaryImageId : 'trmxhnakuc50dbq5a16q'
  );

  // Apply the transformation.
  myImage
    .resize(
      thumbnail()
        .width(size ? size : 60)
        .height(size ? size : 60)
        .gravity(focusOn(FocusOn.face()))
    ) // Crop the image, focusing on the face.
    .roundCorners(byRadius(35));
  // .border(solid(2, 'black')); // Round the corners.

  // Render the transformed image in a React component.
  return (
    <div>
      <AdvancedImage cldImg={myImage} />
    </div>
  );
}
