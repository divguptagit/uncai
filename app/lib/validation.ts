const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const NAME_REGEX = /^[a-zA-Z0-9\s'-]{2,50}$/;
const IMAGE_REGEX = /^data:image\/(jpeg|png|gif|webp);base64,/;

export interface ValidationError {
  field: string;
  message: string;
}

export function validateEmail(email: string): ValidationError | null {
  if (!email) {
    return { field: 'email', message: 'Email is required' };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { field: 'email', message: 'Invalid email format' };
  }
  return null;
}

export function validatePassword(password: string, isNewPassword = false): ValidationError | null {
  if (!password && isNewPassword) {
    return { field: 'password', message: 'Password is required' };
  }
  if (password && !PASSWORD_REGEX.test(password)) {
    return {
      field: 'password',
      message:
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    };
  }
  return null;
}

export function validateName(name: string): ValidationError | null {
  if (!name) {
    return { field: 'name', message: 'Name is required' };
  }
  if (!NAME_REGEX.test(name)) {
    return {
      field: 'name',
      message: 'Name must be between 2 and 50 characters and contain only letters, numbers, spaces, hyphens, and apostrophes',
    };
  }
  return null;
}

export function validateImage(imageData: string): ValidationError | null {
  if (!imageData) {
    return null; // Image is optional
  }
  if (!IMAGE_REGEX.test(imageData)) {
    return {
      field: 'image',
      message: 'Invalid image format. Only JPEG, PNG, GIF, and WebP are supported',
    };
  }
  // Check if base64 string is too large (max 5MB)
  const sizeInBytes = (imageData.length * 3) / 4;
  if (sizeInBytes > 5 * 1024 * 1024) {
    return {
      field: 'image',
      message: 'Image size must be less than 5MB',
    };
  }
  return null;
}

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim();
}

export function validateUserUpdate(data: {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  image?: string;
}): ValidationError[] {
  const errors: ValidationError[] = [];

  if (data.name) {
    const nameError = validateName(data.name);
    if (nameError) errors.push(nameError);
  }

  if (data.email) {
    const emailError = validateEmail(data.email);
    if (emailError) errors.push(emailError);
  }

  if (data.newPassword) {
    if (!data.currentPassword) {
      errors.push({
        field: 'currentPassword',
        message: 'Current password is required to set a new password',
      });
    }
    const passwordError = validatePassword(data.newPassword, true);
    if (passwordError) errors.push(passwordError);
  }

  if (data.image) {
    const imageError = validateImage(data.image);
    if (imageError) errors.push(imageError);
  }

  return errors;
}
