import { Errors } from "moleculer";
const { ValidationError } = Errors;
const { parsePhoneNumber } = require("libphonenumber-js");

export class ValidationUtil {
	static validateOrganizationName(value: string) {
		const regex = /^[a-zA-Z0-9' _\-/&]+$/;
		const minLength = 5;
		const maxLength = 100;

		if (
			typeof value !== "string" ||
			value.replace(/^(?!\s).*?(?<!\s)$/, "") ||
			value.trim().length < minLength ||
			value.trim().length > maxLength ||
			!regex.test(value.toLowerCase())
		) {
			throw new ValidationError("Please enter a valid organization name without spaces");
		}
	}
	static validateURL(value: string) {
		const urlRegex = /^(http:\/\/|https:\/\/)([a-zA-Z0-9]+(-[a-zA-Z0-9]+)*\.)+[a-zA-Z]{2,}$/;
		const maxCharLength = 50;

		if (
			typeof value !== "string" ||
			value.trim().length < 1 ||
			value.trim().length > maxCharLength ||
			value.replace(/^(?!\s).*?(?<!\s)$/, "") ||
			!urlRegex.test(value.toLowerCase())
		) {
			throw new ValidationError(
				"Please enter a valid website URL starting with http:// or https:// without spaces",
			);
		}
	}

	static validateDate(value: any) {
		const isoDatetimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
		const currentDate = new Date();
		const selectedDate = new Date(value);

		if (
			typeof value !== "string" ||
			value.trim().length < 1 ||
			value.replace(/^(?!\s).*?(?<!\s)$/, "")
		) {
			throw new ValidationError("Please select valid organization start date");
		}
	}

	static validateNotManualEntry(value: any) {
		const manualEntryKeywords = ["0", "1", "2", "3", "4"];

		if (
			(typeof value !== "string" && /\s/.test(value)) ||
			!manualEntryKeywords.includes(value)
		) {
			throw new ValidationError("Please select employee range");
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

	static validateFaxNumber(value: string) {
		const maxLength = 10;
		const numericRegex = /^[0-9]+$/;

		if (
			typeof value !== "string" ||
			value.length > maxLength ||
			value.length === 0 || // Ensure non-empty input
			!numericRegex.test(value)
		) {
			throw new ValidationError("Please enter a valid fax number");
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
			!emailRegex.test(value)
		) {
			throw new ValidationError("Please enter a valid email ID");
		}
	}

	static validateRegistrationNumber(value: string) {
		const regex = /^[0-9]+$/;
		const maxLength = 15;

		if (
			typeof value !== "string" ||
			value.trim().length < 1 ||
			value.trim().length > maxLength ||
			value.replace(/^(?!\s).*?(?<!\s)$/, "") ||
			!regex.test(value.toLowerCase())
		) {
			throw new ValidationError("Please enter a valid registration number without spaces");
		}
	}

	static validateOrganizationHead(value: string) {
		const regex = /^[a-zA-Z ]+$/;
		const minLength = 5;
		const maxLength = 30;

		if (
			typeof value !== "string" ||
			value.trim().length < minLength ||
			value.trim().length > maxLength ||
			value.replace(/^(?!\s).*?(?<!\s)$/, "") ||
			!regex.test(value.toLowerCase())
		) {
			throw new ValidationError("Please enter a valid organization head without spaces");
		}
	}

	static validateDesignation(value: string) {
		const maxArrayLength = 30;
		const maxLength = 500;
		const regex = /^[a-zA-Z0-9' _\-/&]+$/;

		if (!Array.isArray(value) || value.length > maxArrayLength) {
			throw new ValidationError(`Maximum designation should be ${maxArrayLength}`);
		}

		for (const item of value) {
			if (
				typeof item !== "string" ||
				item.trim().length > maxLength ||
				!regex.test(item) ||
				item.replace(/^(?!\s).*?(?<!\s)$/, "")
			) {
				throw new ValidationError("Please enter a valid designation");
			}
		}
	}

	static validateMainBranchAddress(value: string) {
		const regex = /^[a-zA-Z0-9' _\-/&]+$/;
		const maxLength = 100;

		if (
			typeof value !== "string" ||
			value.trim().length > maxLength ||
			value.replace(/^(?!\s).*?(?<!\s)$/, "") ||
			!regex.test(value.toLowerCase())
		) {
			throw new ValidationError("Please enter a valid address without spaces");
		}
	}

	static validateOrganizationDescription(value: string) {
		const regex = /^[a-zA-Z0-9' _\-/&]+$/;
		const maxLength = 500;

		if (
			typeof value !== "string" ||
			value.trim().length > maxLength ||
			value.length < 1 ||
			value.replace(/^(?!\s).*?(?<!\s)$/, "") ||
			!regex.test(value.toLowerCase())
		) {
			throw new ValidationError("Please enter a valid  description without spaces");
		}
	}

	static validateCity(value: string) {
		const minLength = 1;
		if (
			typeof value !== "string" ||
			value.trim().length < minLength ||
			value.replace(/^(?!\s).*?(?<!\s)$/, "")
		) {
			throw new ValidationError("Please select a non-empty city without spaces");
		}
	}

	static validateState(value: string) {
		const minLength = 1;
		if (
			typeof value !== "string" ||
			value.trim().length < minLength ||
			value.replace(/^(?!\s).*?(?<!\s)$/, "")
		) {
			throw new ValidationError("Please select a non-empty state without spaces");
		}
	}

	static validateCountry(value: string) {
		const minLength = 1;
		if (
			typeof value !== "string" ||
			value.trim().length < minLength ||
			value.replace(/^(?!\s).*?(?<!\s)$/, "")
		) {
			throw new ValidationError("Please select a non-empty country without spaces");
		}
	}
}
