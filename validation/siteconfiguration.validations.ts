import { Errors } from "moleculer";
const { ValidationError } = Errors;

export class SiteValidationUtil {
    static validateEmployeeCode(value: string) {
        const regex = /^[a-zA-Z0-9_'\/-]*$/;
        const minLength = 1;
        const maxLength = 10;

        if (
            typeof value !== "string" ||
            value.trim().length < minLength ||
            value.length > maxLength ||
            !regex.test(value.toLowerCase()) ||
            value.includes(" ") )

         {
            throw new ValidationError("Please enter a valid employee code");
        }
    }

    static validateDateFormat(value: string) {
        const minLength = 1;

        if (typeof value !== "string" || value.length < minLength ) {
            throw new ValidationError("Please select a date format");
        }
    }

    static validateTimeFormat(value: string) {
        const minLength = 1;

        if (typeof value !== "string" || value.length < minLength ) {
            throw new ValidationError("Please select time format");
        }
    }

    static validateTimeZone(value: string) {
        const minLength = 1;
        if (typeof value !== "string" || value.length < minLength) {
            throw new ValidationError("Please select time zone");
        }
    }

    static validateCurrency(value: string) {
        const minLength = 1;
        if (typeof value !== "string" ||value.length < minLength ) {
            throw new ValidationError("Please select currency");
        }
    }
   

    static validatePrimaryColour(value: string) {
        const minLength = 1;
        if (typeof value !== "string" || value.length < minLength || value.includes(" ")) {
            throw new ValidationError("Please select Primary Color");
        }
    }

    static validateSecondaryColour(value: string) {
        const minLength = 1;
        if (typeof value !== "string" ||value.length < minLength || value.includes(" ") ) {
            throw new ValidationError("Please select Secondary Color");
        }
    }

    static validateTertiaryColour(value: string) {
        const minLength = 1;
        if (typeof value !== "string" ||value.length < minLength || value.includes(" ")) {
            throw new ValidationError("Please select Tertiary Color");
        }
    }

    static validateThemeFontfamily(value: string) {
        const ThemeFontfamily = ["Lato", "Nunito", "Inter", "Poppins", "Rubik"];

        if (typeof value === "string" && ThemeFontfamily.includes(value.trim())) {
            return;
        }
        throw new ValidationError("Please select font family");
    }


    static validateThemeFontSize(value: string) {
        const ThemeFontSize = ["15px", "16px", "18px", "18px", "20px", "22px", "25px", "28px"];

        if (typeof value === "string" && ThemeFontSize.includes(value.trim())) {
            return;
        }

        throw new ValidationError("Please select a valid font size");
    }


    static validateDefaultPassword(value: string) {
        const minLength = 1;

        if (typeof value !== "string" || value.length < minLength ) {
            throw new ValidationError("Please select default password format");
        }

    }

    static validateEmployeeStatus(value: [string]) {

        const EmployeeStatus = ["Permanent", "Full Time", "Part Time", "Probation", "Suspended", "Temporary", "Resigned"];


        if (typeof value === "string" || (Array.isArray(value) && value.every(item => typeof item === "string" && EmployeeStatus.includes(item)))) {
            return;
        }

        throw new ValidationError("Please select a valid employee status");
    }
}