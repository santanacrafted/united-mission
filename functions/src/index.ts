import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import * as nodemailer from 'nodemailer';
import * as logger from 'firebase-functions/logger';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

const gmailUser = defineSecret('EMAIL_USER');
const gmailPass = defineSecret('EMAIL_PASS');

export const sendContactEmail = onCall(
  {
    secrets: [gmailUser, gmailPass],
    region: 'us-central1',
  },
  async (request) => {
    const { name, email, message } = request.data;

    logger.info('Preparing transporter...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser.value(),
        pass: gmailPass.value(),
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: 'dsantanam2@gmail.com',
      subject: 'United Missions Contact Form',
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    try {
      logger.info('Sending email...');
      await transporter.sendMail(mailOptions);
      logger.info('Email sent successfully.');
      return { success: true };
    } catch (error: any) {
      logger.error('Failed to send email', error);
      throw new Error('Failed to send email: ' + error.message);
    }
  }
);

export const createAlbum = onCall(
  {
    region: 'us-central1',
  },
  async (request) => {
    const {
      albumId,
      albumName,
      albumNameEs,
      description,
      descriptionEs,
      coverPhotoUrl = '',
      totalItems = 0,
    } = request.data;

    if (!albumId || !albumName) {
      throw new HttpsError(
        'invalid-argument',
        'albumId and albumName are required.'
      );
    }

    try {
      const albumRef = db
        .collection('unitedMissionsGalleryAlbums')
        .doc(albumId);

      await albumRef.set({
        name: {
          en: albumName,
          es: albumNameEs || '',
        },
        description: {
          en: description || '',
          es: descriptionEs || '',
        },
        coverImage: coverPhotoUrl,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        totalItems,
      });

      console.log('Album created with ID:', albumId);

      return {
        success: true,
        albumId,
        coverPhotoUrl,
      };
    } catch (error: any) {
      console.error('Firestore error:', error);
      throw new HttpsError('internal', 'Failed to create album');
    }
  }
);

export const deleteGalleryAlbum = onCall(
  { region: 'us-central1' },
  async (request) => {
    const { albumId } = request.data;
    if (!albumId) throw new Error('Album ID is required.');

    const folderPath = `united-mission-gallery/${albumId}/`;
    const bucket = admin.storage().bucket(); // 👈 FIXED

    // 🔥 Delete all images in the album folder
    const [files] = await bucket.getFiles({ prefix: folderPath });
    const deletePromises = files.map((file) => file.delete());
    await Promise.all(deletePromises);

    // 🔥 Delete album metadata
    await db.doc(`unitedMissionsGalleryAlbums/${albumId}`).delete();

    return { success: true, deletedCount: files.length };
  }
);

export const addImagesToAlbum = onCall(
  { region: 'us-central1' },
  async (request) => {
    const { albumId, images } = request.data;

    if (!albumId || !Array.isArray(images) || images.length === 0) {
      throw new HttpsError(
        'invalid-argument',
        'albumId and at least one image are required.'
      );
    }

    try {
      const albumRef = db
        .collection('unitedMissionsGalleryAlbums')
        .doc(albumId);
      const batch = db.batch();

      images.forEach((img: any) => {
        const imgRef = albumRef.collection('images').doc();
        batch.set(imgRef, {
          name: img.name || '',
          url: img.url,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      });

      await batch.commit();

      return { success: true, addedCount: images.length, images };
    } catch (error: any) {
      console.error('Error adding images:', error);
      throw new HttpsError('internal', 'Failed to add images to album.');
    }
  }
);

export const updateAlbum = onCall(
  { region: 'us-central1' },
  async (request) => {
    const {
      albumId,
      updatedTitleEn,
      updatedTitleEs,
      updatedDescriptionEn,
      updatedDescriptionEs,
      newCoverPhotoUrl,
    } = request.data;

    if (!albumId) {
      throw new HttpsError('invalid-argument', 'Album ID is required.');
    }

    try {
      const albumRef = db
        .collection('unitedMissionsGalleryAlbums')
        .doc(albumId);

      const updateData: any = {
        name: {
          en: updatedTitleEn || '',
          es: updatedTitleEs || '',
        },
        description: {
          en: updatedDescriptionEn || '',
          es: updatedDescriptionEs || '',
        },
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      if (newCoverPhotoUrl) {
        updateData.coverImage = newCoverPhotoUrl;
      }

      await albumRef.update(updateData);

      return {
        success: true,
        ...(newCoverPhotoUrl && { coverImage: newCoverPhotoUrl }),
      };
    } catch (error: any) {
      console.error('Error updating album:', error);
      throw new HttpsError('internal', 'Failed to update album.');
    }
  }
);

// ... [Your existing imports and functions remain unchanged above]

/**
 * ✅ Register User (awaiting admin approval)
 */
export const registerUser = onCall(
  {
    secrets: [gmailUser, gmailPass],
    region: 'us-central1',
  },
  async (request) => {
    const { email, displayName, role } = request.data;

    if (!email || !role) {
      throw new HttpsError('invalid-argument', 'Email and role are required.');
    }

    try {
      const userRef = db.collection('pendingUsers').doc(email);
      await userRef.set({
        email,
        displayName: displayName || '',
        roles: Array.isArray(role) ? role : [role], // Store as array
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        approved: false,
      });

      // ✅ Add notification for admins
      await db.collection('notifications').add({
        type: 'user-registration',
        message: `${email} has registered and is awaiting approval.`,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        seenBy: [], // List of admin UIDs that have seen this notification
      });

      return { success: true };
    } catch (error: any) {
      console.error('Error registering user:', error);
      throw new HttpsError('internal', 'Failed to register user.');
    }
  }
);

/**
 * ✅ Approve User and Send Email Notification
 */
// ✅ Cloud Function to Approve User and Add Role(s)
export const approveUser = onCall(
  {
    secrets: [gmailUser, gmailPass],
    region: 'us-central1',
  },
  async (request) => {
    const { email, roles: providedRoles } = request.data;

    if (!email) {
      throw new HttpsError('invalid-argument', 'Email is required.');
    }

    try {
      const userDoc = await db.collection('pendingUsers').doc(email).get();

      if (!userDoc.exists) {
        throw new HttpsError('not-found', 'Pending user not found.');
      }

      const userData = userDoc.data();
      if (!userData) {
        throw new HttpsError('not-found', 'User data not found.');
      }

      const userRecord = await admin.auth().getUserByEmail(email);

      // 🔐 Use provided roles if passed in, otherwise fallback to existing pending ones
      const roles = Array.isArray(providedRoles)
        ? providedRoles
        : Array.isArray(userData.roles)
        ? userData.roles
        : userData.role
        ? [userData.role]
        : ['viewer'];

      // 🔐 Set custom claims
      await admin.auth().setCustomUserClaims(userRecord.uid, { roles });

      // ✅ Save to approvedUsers
      await db
        .collection('approvedUsers')
        .doc(email)
        .set({
          ...userData,
          roles,
          approved: true,
          approvedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

      // 🗑 Remove from pending users
      await db.collection('pendingUsers').doc(email).delete();

      // 📧 Notify user
      await sendEmail({
        to: email,
        subject: 'Your United Missions Account Is Approved',
        body: `Hi ${
          userData?.displayName || ''
        }, your account has been approved.`,
      });

      return { success: true };
    } catch (error: any) {
      console.error('Approve error:', error);
      throw new HttpsError('internal', 'Failed to approve user.');
    }
  }
);

// ✅ Update Roles for Approved User
export const updateUserRoles = onCall(
  { region: 'us-central1' },
  async (request) => {
    const { email, roles } = request.data;
    if (!email || !Array.isArray(roles)) {
      throw new HttpsError(
        'invalid-argument',
        'Email and roles array required.'
      );
    }

    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      await admin.auth().setCustomUserClaims(userRecord.uid, { roles });

      await db.collection('approvedUsers').doc(email).update({ roles });

      return { success: true };
    } catch (err: any) {
      console.error('Error updating roles:', err);
      throw new HttpsError('internal', 'Failed to update roles.');
    }
  }
);

/**
 * 📧 Reusable Email Sender
 */
export async function sendEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser.value(),
      pass: gmailPass.value(),
    },
  });

  const mailOptions = {
    from: `"United Missions" <${gmailUser.value()}>`,
    to,
    subject,
    html: `<p>${body}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${to}`);
  } catch (err) {
    logger.error('Email failed to send:', err);
    throw new HttpsError('internal', 'Failed to send email.');
  }
}

export const deleteUser = onCall(
  {
    region: 'us-central1',
  },
  async (request) => {
    const { email } = request.data;

    if (!email) {
      throw new HttpsError('invalid-argument', 'Email is required.');
    }

    try {
      // 🔍 Get user by email to get UID
      const userRecord = await admin.auth().getUserByEmail(email);

      // 🗑 Delete user from Firebase Auth
      await admin.auth().deleteUser(userRecord.uid);

      // 🗑 Delete from approvedUsers and pendingUsers if exists
      await Promise.all([
        db.collection('approvedUsers').doc(email).delete(),
        db.collection('pendingUsers').doc(email).delete(),
      ]);

      logger.info(`Deleted user ${email} from Auth and Firestore`);
      return { success: true };
    } catch (error: any) {
      logger.error('Error deleting user:', error);
      throw new HttpsError('internal', 'Failed to delete user.');
    }
  }
);

/**
 * 🔐 Manually assign 'admin' role to an existing user
 */
export const setAdminRole = onCall(
  {
    region: 'us-central1',
  },
  async (request) => {
    const { email } = request.data;

    if (!email) {
      throw new HttpsError('invalid-argument', 'Email is required.');
    }

    try {
      const user = await admin.auth().getUserByEmail(email);
      await admin.auth().setCustomUserClaims(user.uid, { roles: ['admin'] });

      await db
        .collection('approvedUsers')
        .doc(email)
        .set(
          {
            roles: ['admin'],
            approved: true,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );

      return {
        success: true,
        message: `Admin role set for ${email}`,
      };
    } catch (error: any) {
      console.error('Error setting admin role:', error);
      throw new HttpsError('internal', 'Failed to set admin role.');
    }
  }
);
