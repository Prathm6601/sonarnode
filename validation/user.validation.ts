import { Errors } from "moleculer";
const { ValidationError } = Errors;

export class UserValidationUtil {

    static validateUserCode(value: string) {
		const minLength = 1;
		if (
			typeof value !== "string" ||
		    value.replace(/^(?!\s).*?(?<!\s)$/, "") ||
			value.trim().length < minLength ||
            value.includes(" ") 
		) {
			throw new ValidationError(`Please enter a valid  user code`);
		}
	}

	static validateFirstName(value: string) {
		const minLength = 1;

		if (
			typeof value !== "string" ||
			value.trim().length < minLength 
		) {
			throw new ValidationError("Please enter a valid  first name");
		}
	}

	static validateLastName(value: string) {
		const minLength = 1;
       if (
			typeof value !== "string" ||
			value.trim().length < minLength
		) {
			throw new ValidationError("Please enter a valid  last name");
		}
	}

	static validateEmail(value: string) {
		const maxLength = 40;
		// Regular expression for a simple email validation
		const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

		if (
			typeof value !== "string" ||
			value.trim().length > maxLength ||
			value.trim().length === 0 || // Ensure non-empty input
			value.replace(/^(?!\s).*?(?<!\s)$/, "") ||
			!emailRegex.test(value)||
			value.includes(" ") 

		) {
			throw new ValidationError(`Please enter a valid email address`);
		}
	}

	static validatePhoneNumber(value: string) {
		const maxLength = 15;
		const numericRegex = /^[0-9+]+$/;
		if (
			typeof value !== "string" ||
			value.trim().length > maxLength ||
			!numericRegex.test(value)
		) {
			throw new ValidationError("Please enter a valid phone number");
		}
	}

}