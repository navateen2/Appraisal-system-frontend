import React, { useState, useEffect } from 'react';
import { User, Briefcase, Eye, EyeOff, Save } from 'lucide-react';
import './EditUser.css';
import { useGetUserByIdQuery, useUpdateUserMutation } from '../../api_service/employees/employee.api';
import { useNavigate, useParams } from 'react-router';

interface UserFormData {
  fullName: string;
  workEmail: string;
  initialPassword: string;
  assignRole: string;
  joinedDate: string;
}

interface UpdateUserPayload {
  id: string;
  name: string;
  email: string;
  role: string;
  password?: string;
}

export default function EditUser() {
  let params = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UserFormData>({
    fullName: '',
    workEmail: '',
    initialPassword: '',
    assignRole: 'Employee',
    joinedDate: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // 1. Fetch existing user data (Safeguarded with skip conditional flag)
  const {
  data: userData,
  isLoading: isFetching,
  isError: fetchError,
} = useGetUserByIdQuery(params?.postId!, {
  skip: !params?.postId,
});

  // 2. RTK Query update hook
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  // 3. Populate form when data arrives
  useEffect(() => {
    console.log("Received ", userData);
    if (params.postId && userData) {
      setFormData({
        fullName: userData.name || '',
        workEmail: userData.email || '',
        initialPassword: '', 
        assignRole: userData.role || 'Employee',
        joinedDate: userData.created_at? userData.created_at.slice(0, 10) : '',});
    }
  }, [params.postId, userData]);

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

    if (!formData.workEmail.includes('@') || formData.workEmail.includes(' ')) {
      newErrors.email = 'Enter a valid E-mail layout.';
    }
    
    if (formData.initialPassword && formData.initialPassword.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Build payload structure safely
    const payload: UpdateUserPayload = {
      id: params?.postId ?? '', // Safeguarded type compliance
      name: formData.fullName,
      email: formData.workEmail,
      role: formData.assignRole,
    };

    if (formData.initialPassword) {
      payload.password = formData.initialPassword;
    }

    try {
      await updateUser(payload).unwrap();
      alert('User updated successfully!');
      navigate('/hr/users');
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  const isLoading = isFetching || isUpdating;

  if (isFetching) return <div className="loading-state">Loading employee data...</div>;
  if (fetchError) return <div className="error-state">Error loading employee metadata.</div>;

  return (
    <div className="create-user-container">
      <header className="form-header">
        <h1>Edit User</h1>
        <p>Update Employee Details</p>
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
              <label htmlFor="initialPassword">CHANGE PASSWORD (OPTIONAL)</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="initialPassword"
                  name="initialPassword"
                  placeholder="Leave blank to keep current password"
                  value={formData.initialPassword}
                  onChange={handleChange}
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
                Passwords must match security schemas if modified.
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
          <button 
            type="button" 
            className="btn-cancel" 
            disabled={isLoading} 
            onClick={() => navigate('/hr/users')}
          >
            Cancel
          </button>
          <button type="submit" className="btn-submit" disabled={isLoading}>
            <Save className="btn-icon" size={16} />
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </button>
        </footer>
      </form>
    </div>
  );
}