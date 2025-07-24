import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    title: string;
    summary: string;
  };
  experience: Array<{
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    description?: string;
  }>;
  certifications: Array<{
    title: string;
    issuer: string;
    issueDate: string;
    credentialId?: string;
  }>;
  projects: Array<{
    title: string;
    description: string;
    category: string;
    tags: string[];
  }>;
  skills: string[];
}

export const generateResumePDF = async (data: ResumeData): Promise<void> => {
  // Create a temporary div to render the resume
  const resumeElement = document.createElement('div');
  resumeElement.style.position = 'absolute';
  resumeElement.style.left = '-9999px';
  resumeElement.style.width = '210mm'; // A4 width
  resumeElement.style.backgroundColor = 'white';
  resumeElement.style.fontFamily = 'Arial, sans-serif';
  resumeElement.style.fontSize = '12px';
  resumeElement.style.lineHeight = '1.4';
  resumeElement.style.color = '#333';
  resumeElement.style.padding = '20px';

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Present';
    const [year, month] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  resumeElement.innerHTML = `
    <div style="max-width: 800px; margin: 0 auto; background: white;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #3B82F6;">
        <h1 style="margin: 0; font-size: 28px; color: #1F2937; font-weight: bold;">${data.personalInfo.name}</h1>
        <h2 style="margin: 5px 0 15px 0; font-size: 16px; color: #3B82F6; font-weight: normal;">${data.personalInfo.title}</h2>
        <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; font-size: 11px; color: #6B7280;">
          <span>📧 ${data.personalInfo.email}</span>
          <span>📱 ${data.personalInfo.phone}</span>
          <span>📍 ${data.personalInfo.location}</span>
        </div>
      </div>

      <!-- Professional Summary -->
      <div style="margin-bottom: 25px;">
        <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #1F2937; border-bottom: 1px solid #E5E7EB; padding-bottom: 5px;">PROFESSIONAL SUMMARY</h3>
        <p style="margin: 0; text-align: justify; line-height: 1.5;">${data.personalInfo.summary}</p>
      </div>

      <!-- Skills -->
      ${data.skills.length > 0 ? `
      <div style="margin-bottom: 25px;">
        <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #1F2937; border-bottom: 1px solid #E5E7EB; padding-bottom: 5px;">TECHNICAL SKILLS</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${data.skills.map(skill => `<span style="background: #EFF6FF; color: #1D4ED8; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: 500;">${skill}</span>`).join('')}
        </div>
      </div>
      ` : ''}

      <!-- Experience -->
      ${data.experience.length > 0 ? `
      <div style="margin-bottom: 25px;">
        <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #1F2937; border-bottom: 1px solid #E5E7EB; padding-bottom: 5px;">PROFESSIONAL EXPERIENCE</h3>
        ${data.experience.map(exp => `
          <div style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;">
              <div>
                <h4 style="margin: 0; font-size: 14px; color: #1F2937; font-weight: bold;">${exp.title}</h4>
                <p style="margin: 2px 0; font-size: 12px; color: #3B82F6; font-weight: 500;">${exp.company} • ${exp.location}</p>
              </div>
              <span style="font-size: 11px; color: #6B7280; white-space: nowrap;">${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate || '')}</span>
            </div>
            <p style="margin: 5px 0 0 0; font-size: 11px; line-height: 1.4; text-align: justify;">${exp.description}</p>
          </div>
        `).join('')}
      </div>
      ` : ''}

      <!-- Projects -->
      ${data.projects.length > 0 ? `
      <div style="margin-bottom: 25px;">
        <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #1F2937; border-bottom: 1px solid #E5E7EB; padding-bottom: 5px;">KEY PROJECTS</h3>
        ${data.projects.slice(0, 4).map(project => `
          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 3px;">
              <h4 style="margin: 0; font-size: 13px; color: #1F2937; font-weight: bold;">${project.title}</h4>
              <span style="font-size: 10px; color: #6B7280; background: #F3F4F6; padding: 2px 6px; border-radius: 3px;">${project.category}</span>
            </div>
            <p style="margin: 3px 0; font-size: 11px; line-height: 1.4; text-align: justify;">${project.description}</p>
            <div style="margin-top: 5px;">
              ${project.tags.slice(0, 6).map(tag => `<span style="background: #EFF6FF; color: #1D4ED8; padding: 2px 5px; border-radius: 3px; font-size: 9px; margin-right: 4px;">${tag}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
      ` : ''}

      <!-- Education -->
      ${data.education.length > 0 ? `
      <div style="margin-bottom: 25px;">
        <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #1F2937; border-bottom: 1px solid #E5E7EB; padding-bottom: 5px;">EDUCATION</h3>
        ${data.education.map(edu => `
          <div style="margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 3px;">
              <div>
                <h4 style="margin: 0; font-size: 13px; color: #1F2937; font-weight: bold;">${edu.degree}</h4>
                <p style="margin: 2px 0; font-size: 12px; color: #3B82F6; font-weight: 500;">${edu.institution} • ${edu.location}</p>
              </div>
              <span style="font-size: 11px; color: #6B7280; white-space: nowrap;">${edu.startDate} - ${edu.endDate}</span>
            </div>
            ${edu.description ? `<p style="margin: 3px 0 0 0; font-size: 11px; line-height: 1.4;">${edu.description}</p>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}

      <!-- Certifications -->
      ${data.certifications.length > 0 ? `
      <div style="margin-bottom: 20px;">
        <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #1F2937; border-bottom: 1px solid #E5E7EB; padding-bottom: 5px;">CERTIFICATIONS</h3>
        ${data.certifications.map(cert => `
          <div style="margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h4 style="margin: 0; font-size: 12px; color: #1F2937; font-weight: bold;">${cert.title}</h4>
              <p style="margin: 2px 0; font-size: 11px; color: #3B82F6;">${cert.issuer}${cert.credentialId ? ` • ID: ${cert.credentialId}` : ''}</p>
            </div>
            <span style="font-size: 10px; color: #6B7280;">${formatDate(cert.issueDate)}</span>
          </div>
        `).join('')}
      </div>
      ` : ''}

      <!-- Footer -->
      <div style="text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #E5E7EB; font-size: 10px; color: #6B7280;">
        <p style="margin: 0;">Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>
    </div>
  `;

  document.body.appendChild(resumeElement);

  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(resumeElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // A4 width in pixels at 96 DPI
      height: 1123 // A4 height in pixels at 96 DPI
    });

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    
    // Calculate dimensions to fit A4
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    // Add image to PDF
    if (imgHeight <= pdfHeight) {
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    } else {
      // If content is too long, split into multiple pages
      let position = 0;
      const pageHeight = pdfHeight;
      
      while (position < imgHeight) {
        if (position > 0) {
          pdf.addPage();
        }
        
        pdf.addImage(imgData, 'PNG', 0, -position, imgWidth, imgHeight);
        position += pageHeight;
      }
    }

    // Download the PDF
    pdf.save(`${data.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF. Please try again.');
  } finally {
    // Clean up
    document.body.removeChild(resumeElement);
  }
};