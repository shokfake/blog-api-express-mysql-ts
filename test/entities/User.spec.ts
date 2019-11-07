import expect from 'expect';
import User from '../../src/entities/User';

describe('user entity tests', () => {
  it('can create an instance of the User entity', () => {
    const username = 'fake-username';
    const displayName = 'fake-display-name';
    const bio = 'fake-bio';
    const birthDate = new Date();
    const user = new User(username, displayName, bio, birthDate);
    expect(user.username).toBe(username);
    expect(user.displayName).toBe(displayName);
    expect(user.bio).toBe(bio);
    expect(user.birthDate).toBe(birthDate);
  });
});
