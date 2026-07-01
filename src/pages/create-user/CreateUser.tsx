import React, { useState } from 'react';
import { User, Briefcase, Eye, EyeOff, UserPlus } from 'lucide-react';
import './CreateUser.css';
import { useCreateUserMutation } from '../../api_service/employees/employee.api';
import { useNavigate } from 'react-router';

export default function CreateUser() {
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    initialPassword: '',
    assignRole: 'Employee',
    joinedDate: '',
  });
  const navigate=useNavigate()

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // RTK Query hook
  const [createUser, { isLoading, error: apiError }] = useCreateUserMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.workEmail.includes('@')) {
      newErrors.email = 'Email must contain an @ symbol.';
    }
    if (formData.initialPassword.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Maps local state values to match the UserCreate Pydantic schema
    const payload = {
      name: formData.fullName,
      email: formData.workEmail,
      role: formData.assignRole, 
      password: formData.initialPassword,
    };

    await createUser(payload).unwrap();
    // Reset form states on successful execution
    setFormData({
    fullName: '',
    workEmail: '',
    initialPassword: '',
    assignRole: 'Employee',
    joinedDate: '',
    });
    alert('User created successfully!');
    navigate('/hr/users')
  };

  return (
    <div className="create-user-container">
      <header className="form-header">
        <h1>Create User</h1>
        <p>Create a new Employee Account</p>
      </header>

      <form onSubmit={handleSubmit} className="user-form">
        {/* Section 1: Personal Information */}
        <section className="form-section">
          <div className="section-title">
            <User className="icon" size={18} />
            <h2>Personal Information</h2>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="fullName">FULL NAME</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Name"
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="workEmail">WORK EMAIL</label>
              <input
                type="email"
                id="workEmail"
                name="workEmail"
                placeholder="Email"
                value={formData.workEmail}
                onChange={handleChange}
                required
                disabled={isLoading}
                className={errors.email ? 'input-error' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="initialPassword">INITIAL PASSWORD</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="initialPassword"
                  name="initialPassword"
                  placeholder="Password"
                  value={formData.initialPassword}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className={errors.password ? 'input-error' : ''}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <span className="help-text">
                Passwords must be at least 12 characters with special symbols.
              </span>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>
          </div>
        </section>

        {/* Section 2: Account & Employment */}
        <section className="form-section">
          <div className="section-title">
            <Briefcase className="icon" size={18} />
            <h2>Account & Employment</h2>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="assignRole">ASSIGN ROLE</label>
              <select
                id="assignRole"
                name="assignRole"
                value={formData.assignRole}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="Employee">Employee</option>
                <option value="HR">HR</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="joinedDate">JOINED DATE</label>
              <input
                type="date"
                id="joinedDate"
                name="joinedDate"
                value={formData.joinedDate}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>
        </section>

        {/* Form Actions */}
        <footer className="form-actions">
          <button type="button" className="btn-cancel" disabled={isLoading} onClick={()=>navigate('/hr/users')
}>
            Cancel
          </button>
          <button type="submit" className="btn-submit" disabled={isLoading}>
            <UserPlus className="btn-icon" size={16} />
            {isLoading ? 'Creating...' : 'Create Employee'}
          </button>
        </footer>
      </form>
    </div>
  );
}