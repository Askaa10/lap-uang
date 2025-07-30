export class StudentDto {
  id?: string;
  name?: string;
  email?: string;
  age?: number;
}

export class CreateStudentDto {
  studentId: string;
  name: string;
  regisNumber: string;
  dorm?: string;
  generation: number;
  major: 'RPL' | 'TKJ';
}


export class UpdateStudentDto {
  id: string;
  name?: string;
  email?: string;
  age?: number;
  dorm?: string;
  generation?: number;
  major?: 'RPL' | 'TKJ';
}