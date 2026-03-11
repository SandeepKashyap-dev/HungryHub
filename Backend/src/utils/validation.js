 const validateEmail=(email)=>{
    const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailregex.test(email);
};

const validatePassword=(password)=>{
    const passwordregex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordregex.test(password);
}
const validateFullName=(fullname)=>{
    const fullnameRegex = /^[a-zA-Z]+(?:\s[a-zA-Z]+)+$/;
    return fullnameRegex.test(fullname);
}
const validatePhoneNumber=(phoneNumber)=>{
    const phoneNumberRegex = /^\d{10}$/;
    return phoneNumberRegex.test(phoneNumber);
}
const validateAddress=(address)=>{
    return address.trim() !== '';
}      
const getPasswordStrength=(password)=>{
    let strength = 0;
    if (password.length >= 8) strength++;
    if(password.length>=12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    return strength;
};
export {validateEmail,validatePassword,validateFullName,validatePhoneNumber,validateAddress,getPasswordStrength};
