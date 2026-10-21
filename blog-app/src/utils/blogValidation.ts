interface BlogFormValues {
  title: string;
  content: string;
}

interface ValidationResult {
  valid: boolean;
  error: string;
}

export function validateBlog( values: BlogFormValues ): ValidationResult {
  const title = values.title.trim();
  const content = values.content.trim();

  if (!title) {
    return { valid: false, error: "Please enter a blog title." };
  }

  if (title.length > 150) {
    return {
      valid: false,
      error: "Title cannot exceed 150 characters.",
    };
  }

  if (!content) {
    return { valid: false, error: "Please enter blog content." };
  }

  if (content.length < 20) {
    return {
      valid: false,
      error: "Blog content must contain at least 20 characters.",
    };
  }

  if (content.length > 10000) {
    return {
      valid: false,
      error: "Blog content cannot exceed 10,000 characters.",
    };
  }

  return { valid: true, error: "" };
}